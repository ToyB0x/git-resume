import type { Pack, Summary } from "@/models";
import { create } from "./create";
import { load } from "./load";

interface SummaryService {
  create: (
    userName: string,
    packs: Pack[],
    skipConfirm: boolean,
  ) => Promise<void>;
  load: (userName: string) => Summary[];
}

export const summaryService: SummaryService = {
  create: create,
  load: load,
};
