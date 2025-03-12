import type { Repository, User } from "@resume/models";
import type { getOctokit } from "./client";

export interface GithubService {
  getUserDetail: (
    userName: string,
    octokitApp: ReturnType<typeof getOctokit>,
  ) => Promise<User>;
  getUserCommitedRepositories: (
    userName: string,
    publicOnly: boolean,
    octokitApp: ReturnType<typeof getOctokit>,
  ) => Promise<Repository[]>;
  // instead of git commands (for case not setup git ssh config, like in CI)
  cloneOrPullRepositories: (repository: Repository) => Promise<void>;
}
