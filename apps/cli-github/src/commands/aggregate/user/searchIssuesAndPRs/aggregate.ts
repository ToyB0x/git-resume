import { dbClient, octokitApp } from "@/clients";
import { searchIssuesAndPRsTbl } from "@/db";
import { isBefore, subDays } from "date-fns";

export const aggregate = async (
  userName: string,
  repoVisibility: "public" | "private",
) => {
  await _aggregate(userName, "issue", repoVisibility);
  await _aggregate(userName, "pr", repoVisibility);
};

export const _aggregate = async (
  userName: string,
  type: "pr" | "issue",
  repoVisibility: "public" | "private",
) => {
  // ref: https://docs.github.com/ja/search-github/searching-on-github/searching-issues-and-pull-requests#search-by-author
  const issuesAndPrs = await octokitApp.paginate(
    octokitApp.rest.search.issuesAndPullRequests,
    {
      q: `author:${userName} type:${type} is:${repoVisibility}`,
      sort: "created",
      order: "desc",
      per_page: 100,
    },
    (response, done) => {
      if (
        response.data.find((pr) =>
          isBefore(new Date(pr.created_at), subDays(new Date(), 360)),
        )
      ) {
        done();
      }
      return response.data;
    },
  );

  for (const issueOrPr of issuesAndPrs) {
    const authorId = issueOrPr.user?.id;
    if (!authorId) throw Error("no author id");

    await dbClient
      .insert(searchIssuesAndPRsTbl)
      .values({
        id: issueOrPr.id,
        number: issueOrPr.number,
        type: type,
        state: issueOrPr.state,
        title: issueOrPr.title,
        body: issueOrPr.body,
        createdAt: new Date(issueOrPr.created_at),
        updatedAt: new Date(issueOrPr.updated_at),
        closedAt: issueOrPr.closed_at ? new Date(issueOrPr.closed_at) : null,
        authorId: authorId,
        repositoryUrl: issueOrPr.repository_url,
        repoVisibility,
      })
      .onConflictDoUpdate({
        target: searchIssuesAndPRsTbl.id,
        set: {
          state: issueOrPr.state,
          title: issueOrPr.title,
          body: issueOrPr.body,
          updatedAt: new Date(issueOrPr.updated_at),
          closedAt: issueOrPr.closed_at ? new Date(issueOrPr.closed_at) : null,
          repoVisibility,
        },
      });
  }
};
