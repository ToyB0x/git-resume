import type { Repository, User } from "@/models";
import { getUserCommitedRepositories } from "./getUserCommitedRepositories";
import { getUserDetail } from "./getUserDetail";

interface GithubService {
  getUserDetail: (userName: string) => Promise<User>;
  getUserCommitedRepositories: (userName: string) => Promise<Repository[]>;
  // instead of git commands (for case not setup git ssh config, like in CI)
  cloneRepositories: () => Promise<void>;
  updateRepositories: () => Promise<void>;
}

export const gitHubService: GithubService = {
  getUserDetail: getUserDetail,
  getUserCommitedRepositories: getUserCommitedRepositories,
  cloneRepositories: async () => {
    throw Error("not implemented");
  },
  updateRepositories: async () => {
    throw Error("not implemented");
  },
};
