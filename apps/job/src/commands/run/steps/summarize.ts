import { env, logger } from "@/utils";
import { packService, summaryService } from "@resume/services";
import { retry } from "@resume/utils";

export const summarize = async (userName: string) => {
  const packs = packService.load(userName);
  for (const [i, pack] of Object.entries(packs)) {
    logger.info(
      `Cloning ${pack.meta.owner}/${pack.meta.repo} (${i + 1} / ${packs.length})`,
    );

    await retry({
      fn: async () =>
        await summaryService.create(userName, pack, env.RESUME_GEMINI_API_KEY),
      timingSeconds: [30, 30, 30, 30, 30], // APIのレートリミットが1分単位の計算のため30秒づつずらす
    });
  }
};
