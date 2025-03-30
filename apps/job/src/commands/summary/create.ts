import { env } from "@/utils";
import confirm from "@inquirer/confirm";
import { packService, summaryService } from "@resume/services";

export const create = async (userName: string, skipConfirm: boolean) => {
  const packs = packService.load(userName);

  for (const pack of packs) {
    if (!skipConfirm) {
      const answer = await confirm({
        message: `${pack.meta.owner}/${pack.meta.repo}: raw text size is ${pack.body.length} (about ${Math.floor(pack.body.length / 4)} token)
Continue?`,
      });

      console.log(answer);
      if (!answer) {
        console.log("Skipped");
        continue;
      }
    }

    await summaryService.create(userName, pack, env.RESUME_GEMINI_API_KEY);
  }
};
