import type { Summary } from "@/models";
import { create } from "./create";

interface ResumeService {
  create: (
    userName: string,
    summaries: Summary[],
    skipConfirm: boolean,
  ) => Promise<void>;
  // update: (userName: string) => Promise<Resume>;
}

export const resumeService: ResumeService = {
  create: create,
  // update: async (userName: string) => {
  //   throw Error("not implemented: " + userName);
  // },
};
