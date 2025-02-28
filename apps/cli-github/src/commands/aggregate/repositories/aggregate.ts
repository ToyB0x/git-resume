import { dbClient, octokitApp } from "@/clients";
import { repositoryTbl } from "@/db";

export const aggregate = async (userName: string) => {
  // ref: https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user
  const authenticatedWithExecuteTokenRepos = await octokitApp.paginate(
    octokitApp.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
      sort: "pushed",
      direction: "desc",
    },
  );

  // ref: https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
  const specifiedUserPublicRepos = await octokitApp.paginate(
    octokitApp.rest.repos.listForUser,
    {
      username: userName,
      per_page: 100,
      sort: "pushed",
      direction: "desc",
    },
  );

  const repos = [
    ...authenticatedWithExecuteTokenRepos,
    ...specifiedUserPublicRepos,
  ];

  for (const repo of repos) {
    const now = new Date();

    await dbClient
      .insert(repositoryTbl)
      .values({
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        isPrivate: !!repo.private,
        isOrgRepo: repo.owner.type === "Organization",
        createdAt: now,
        updatedAt: now,
        createdAtGithub: repo.created_at ? new Date(repo.created_at) : null,
        updatedAtGithub: repo.updated_at ? new Date(repo.updated_at) : null,
      })
      .onConflictDoUpdate({
        target: repositoryTbl.id,
        set: {
          name: repo.name,
          owner: repo.owner.login,
          isPrivate: !!repo.private,
          isOrgRepo: repo.owner.type === "Organization",
          updatedAt: now,
          updatedAtGithub: repo.updated_at ? new Date(repo.updated_at) : null,
        },
      });
  }
};
