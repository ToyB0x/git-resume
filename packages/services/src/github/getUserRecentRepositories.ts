import { getOctokit } from "./client";

export const getUserRecentRepositories = async (
  userName: string,
  githubToken?: string,
) => {
  const octokitApp = getOctokit(githubToken);

  // NOTE: 最大直近1000件のコミットを取得
  // https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
  const repos = await octokitApp.paginate(octokitApp.rest.repos.listForUser, {
    username: userName,
    sort: "pushed",
    direction: "desc",
    per_page: 100,
  });

  return repos.map((repo) => ({
    id: repo.id,
    stars: repo.stargazers_count,
    description: repo.description,
    defaultBranch: repo.default_branch,
    size: repo.size, // The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
    owner: repo.owner,
    name: repo.name,
    isPrivate: repo.private,
    isArchived: repo.archived,
    isTemplate: repo.is_template,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  }));
};
