import type { Repository } from "@resume/models";
import { getOctokit } from "./client";

export const getUserCommitedRepositories = async (
  userName: string,
  publicOnly: boolean,
  githubToken: string,
  callBack?: ({
    commitSize,
    repositories,
  }: { commitSize: number; repositories: string[] }) => Promise<void>,
): Promise<Repository[]> => {
  const octokitApp = getOctokit(githubToken);
  const commitIds = new Set<string>();
  const repositoryIds = new Set<number>();
  const repositoryFullNames = new Set<string>();

  // NOTE: 最大直近1000件のコミットを取得
  // https://docs.github.com/ja/rest/search/search?apiVersion=2022-11-28#search-commits
  const commits = await octokitApp.paginate(
    octokitApp.rest.search.commits,
    {
      q: publicOnly ? `author:${userName} is:public` : `author:${userName}`,
      sort: "author-date",
      order: "desc",
      per_page: 100,
    },
    (response) => {
      for (const commit of response.data) {
        commitIds.add(commit.sha);
        repositoryIds.add(commit.repository.id);
        repositoryFullNames.add(
          `${commit.repository.owner.login}/${commit.repository.name}`,
        );
      }

      if (callBack) {
        callBack({
          commitSize: commitIds.size,
          repositories: [...repositoryFullNames].sort(),
        });
      }
      return response.data;
    },
  );

  return [...repositoryIds].map((repoIds) => {
    const matchedCommit = commits.find(
      (commit) => commit.repository.id === repoIds,
    );
    if (!matchedCommit) throw Error("commit not found");

    return {
      id: matchedCommit.repository.id,
      owner: matchedCommit.repository.owner.login,
      name: matchedCommit.repository.name,
      isPrivate: matchedCommit.repository.private,
    };
  });
};
