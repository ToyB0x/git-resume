import type { Repository, User } from "@resume/models";
import type { getUserRecentRepositories } from "./getUserRecentRepositories";

export interface GithubService {
  getUserDetail: (userName: string, githubToken?: string) => Promise<User>;
  getUserRecentRepositories: (
    userName: string,
    githubToken?: string,
  ) => ReturnType<typeof getUserRecentRepositories>;
  getUserCommitedRepositories: (
    userName: string,
    publicOnly: boolean,
    githubToken?: string,
    callBack?: ({
      commitSize,
      repositories,
    }: { commitSize: number; repositories: string[] }) => Promise<void>,
  ) => Promise<Repository[]>;
  // instead of git commands (for case not setup git ssh config, like in CI)
  cloneOrPullRepositories: (repository: Repository) => Promise<void>;
}
