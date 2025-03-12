import { env } from "@/utils/env";
import confirm from "@inquirer/confirm";
import { resumeService, summaryService } from "@resume/services";

export const create = async (userName: string, skipConfirm: boolean) => {
  const summaries = summaryService.load(userName);

  if (!skipConfirm) {
    const answer = await confirm({
      message: `all summary text size is ${summaries.toString().length} (about ${Math.floor(summaries.toString().length / 4)} token)
Continue?`,
    });

    console.log(answer);
    if (!answer) {
      process.exit(1);
    }
  }

  await resumeService.create(userName, summaries, env.RESUME_GEMINI_API_KEY);
};
