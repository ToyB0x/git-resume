import { packService } from "@/services/pack/interfaces";

export const create = async (userName: string) => {
  const packs = packService.load(userName);
  console.log(packs);
};
