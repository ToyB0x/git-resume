import { gitHubService } from "@resume/services";

export const search = async (userName: string) => {
  const publicOnly = true;
  const githubToken = undefined; // use public api (low rate limit)

  return await gitHubService.getUserCommitedRepositories(
    userName,
    publicOnly,
    githubToken,
  );
};
