import { cloneOrPullRepository } from "./cloneOrPullRepository";
import type { GitService } from "./interfaces";

export const gitService: GitService = {
  cloneOrPullRepository: cloneOrPullRepository,
};
