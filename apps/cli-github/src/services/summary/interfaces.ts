import { create } from "./create";

interface SummaryService {
  create: (userName: string, gitDir: string) => Promise<void>;
  // update: (userName: string, repository: Repository) => Promise<Summary>;
}

export const summaryService: SummaryService = {
  create: create,
  // update: async (userName: string, repository: Repository) => {
  //   throw Error("not implemented: " + userName);
  // },
};
