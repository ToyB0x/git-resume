import { packService } from "@/services/pack/interfaces";
import { summaryService } from "@/services/summary/interfaces";

export const create = async (userName: string, skipConfirm: boolean) => {
  const packs = packService.load(userName);

  await summaryService.create(userName, packs, skipConfirm);
};
