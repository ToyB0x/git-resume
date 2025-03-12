import { create } from "./create";
import type { ResumeService } from "./interfaces";

export const resumeService: ResumeService = {
  create: create,
  // update: async (userName: string) => {
  //   throw Error("not implemented: " + userName);
  // },
};
