import { resumeService } from "@/services/resume/interfaces";
import { summaryService } from "@/services/summary/interfaces";

export const create = async (userName: string) => {
  const summaries = summaryService.load(userName);

  await resumeService.create(userName, summaries);
};
