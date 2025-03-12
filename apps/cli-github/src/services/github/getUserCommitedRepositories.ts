import type { Repository } from "@/models";
import { octokitApp } from "./client";

export const getUserCommitedRepositories = async (
  userName: string,
  publicOnly: boolean,
): Promise<Repository[]> => {
  // NOTE: 最大直近1000件のコミットを取得
  // https://docs.github.com/ja/rest/search/search?apiVersion=2022-11-28#search-commits
  const commits = await octokitApp.paginate(octokitApp.rest.search.commits, {
    q: publicOnly ? `author:${userName} is:public` : `author:${userName}`,
    sort: "author-date",
    order: "desc",
    per_page: 100,
  });

  const repositoryIds = [
    ...new Set(commits.map((commit) => commit.repository.id)),
  ];

  return repositoryIds.map((repoIds) => {
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
