export type GitRepository = {
  owner: string;
  name: string;
  commits: GitCommit[];
};

export type GitCommit = {
  sha: string;
  gitShowResult: string;
};

export type Resume = {
  sha: string;
  gitShowResult: string;
};

export type Summary = {
  sha: string;
  gitShowResult: string;
};
