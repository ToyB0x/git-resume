import type { Repository, Summary } from "@/models";

interface SummaryService {
  create: (userName: string, repository: Repository) => Promise<Summary>;
  update: (userName: string, repository: Repository) => Promise<Summary>;
}

export const resumeService: SummaryService = {
  create: async (userName: string, repository: Repository) => {
    throw Error("not implemented: " + userName);
  },
  update: async (userName: string, repository: Repository) => {
    throw Error("not implemented: " + userName);
  },
};
