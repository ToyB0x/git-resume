import type { Repository } from "@resume/models";
import { getUserCommitedRepositories } from "./getUserCommitedRepositories";
import { getUserDetail } from "./getUserDetail";
import { getUserRecentRepositories } from "./getUserRecentRepositories";
import type { GithubService } from "./interfaces";

export const gitHubService: GithubService = {
  getUserDetail: getUserDetail,
  getUserCommitedRepositories: getUserCommitedRepositories,
  getUserRecentRepositories: getUserRecentRepositories,
  // instead of git commands (for case not setup git ssh config, like in CI)
  cloneOrPullRepositories: async (repository: Repository) => {
    throw Error(`not·implemented:·${repository.name}`);
  },
};
