import type { Summary } from "@resume/models";

export interface ResumeService {
  create: (
    userName: string,
    summaries: Summary[],
    RESUME_GEMINI_API_KEY: string,
  ) => Promise<string>;
  // update: (userName: string) => Promise<Resume>;
}
