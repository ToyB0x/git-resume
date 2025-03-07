import type { Repository, User } from "@/models";
import { getUserCommitedRepositories } from "./getUserCommitedRepositories";
import { getUserDetail } from "./getUserDetail";

interface GithubService {
  getUserDetail: (userName: string) => Promise<User>;
  getUserCommitedRepositories: (userName: string) => Promise<Repository[]>;
}

export const gitHubService: GithubService = {
  getUserDetail: getUserDetail,
  getUserCommitedRepositories: getUserCommitedRepositories,
};
