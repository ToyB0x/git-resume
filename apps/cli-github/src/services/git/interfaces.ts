import type { Repository } from "@/models";
import { cloneOrPullRepository } from "./cloneOrPullRepository";

interface GitService {
  cloneOrPullRepository: (repository: Repository) => Promise<void>;
}

export const gitService: GitService = {
  cloneOrPullRepository: cloneOrPullRepository,
};
