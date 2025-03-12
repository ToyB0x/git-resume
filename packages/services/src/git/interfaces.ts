import type { Repository } from "@resume/models";

export interface GitService {
  cloneOrPullRepository: (repository: Repository) => Promise<void>;
}
