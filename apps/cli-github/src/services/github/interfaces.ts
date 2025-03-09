import type { Repository, User } from "@/models";
import { getUserCommitedRepositories } from "./getUserCommitedRepositories";
import { getUserDetail } from "./getUserDetail";

interface GithubService {
  getUserDetail: (userName: string) => Promise<User>;
  getUserCommitedRepositories: (userName: string) => Promise<Repository[]>;
  // instead of git commands (for case not setup git ssh config, like in CI)
  // cloneOrPullRepositories: (repository: Repository) => Promise<void>;
}

export const gitHubService: GithubService = {
  getUserDetail: getUserDetail,
  getUserCommitedRepositories: getUserCommitedRepositories,
  // instead of git commands (for case not setup git ssh config, like in CI)
  // cloneOrPullRepositories: async (repository: Repository) => {
  //   throw Error("not implemented: " + repository.name);
  // },
};
