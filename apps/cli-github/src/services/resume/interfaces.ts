import type { Resume } from "@/models";

interface ResumeService {
  create: (userName: string) => Promise<Resume>;
  update: (userName: string) => Promise<Resume>;
}

export const resumeService: ResumeService = {
  create: async (userName: string) => {
    throw Error("not implemented: " + userName);
  },
  update: async (userName: string) => {
    throw Error("not implemented: " + userName);
  },
};
