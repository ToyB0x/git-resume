import { env } from "@/utils";
import { resumeService, summaryService } from "@resume/services";
import { retry } from "@resume/utils";

export const generateResume = async (userName: string) => {
  const summaries = summaryService.load(userName);

  return await retry({
    fn: async () =>
      await resumeService.create(
        userName,
        summaries,
        env.RESUME_GEMINI_API_KEY,
      ),
    timingSeconds: [30, 30, 30, 30, 30], // APIのレートリミットが1分単位の計算のため30秒づつずらす
  });
};
