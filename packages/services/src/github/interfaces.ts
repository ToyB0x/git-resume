import type { Repository, User } from "@resume/models";

export interface GithubService {
  getUserDetail: (userName: string, githubToken: string) => Promise<User>;
  getUserCommitedRepositories: (
    userName: string,
    publicOnly: boolean,
    githubToken: string,
    callBack?: ({
      commitSize,
      repositories,
    }: { commitSize: number; repositories: string[] }) => Promise<void>,
  ) => Promise<Repository[]>;
  // instead of git commands (for case not setup git ssh config, like in CI)
  cloneOrPullRepositories: (repository: Repository) => Promise<void>;
}
