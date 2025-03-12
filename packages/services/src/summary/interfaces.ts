import type { Pack, Summary } from "@resume/models";

export interface SummaryService {
  create: (
    userName: string,
    pack: Pack,
    RESUME_GEMINI_API_KEY: string,
  ) => Promise<void>;
  load: (userName: string) => Summary[];
}
