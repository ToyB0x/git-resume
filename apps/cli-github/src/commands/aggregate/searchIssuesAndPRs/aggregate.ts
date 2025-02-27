import { isBefore, subDays } from "date-fns";
import { getDbClient, octokitApp } from "@/clients";
import { searchIssuesAndPRsTbl } from "@/db";

export const aggregate = async (userName: string) => {
  // ref: https://docs.github.com/ja/search-github/searching-on-github/searching-issues-and-pull-requests#search-by-author
  const issuesAndPrs = await octokitApp.paginate(
    octokitApp.rest.search.issuesAndPullRequests,
    {
      // q: `is:pr is:public author:${userName}`,
      q: `author:${userName}`,
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

    await getDbClient(userName)
      .insert(searchIssuesAndPRsTbl)
      .values({
        id: issueOrPr.id,
        number: issueOrPr.number,
        state: issueOrPr.state,
        title: issueOrPr.title,
        body: issueOrPr.body,
        createdAt: new Date(issueOrPr.created_at),
        updatedAt: new Date(issueOrPr.updated_at),
        closedAt: issueOrPr.closed_at ? new Date(issueOrPr.closed_at) : null,
        authorId: authorId,
        repositoryUrl: issueOrPr.repository_url,
      })
      .onConflictDoUpdate({
        target: searchIssuesAndPRsTbl.id,
        set: {
          state: issueOrPr.state,
          title: issueOrPr.title,
          body: issueOrPr.body,
          updatedAt: new Date(issueOrPr.updated_at),
          closedAt: issueOrPr.closed_at ? new Date(issueOrPr.closed_at) : null,
        },
      });
  }
};
