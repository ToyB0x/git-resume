import { create } from "./create";
import type { SummaryService } from "./interfaces";
import { load } from "./load";

export const summaryService: SummaryService = {
  create: create,
  load: load,
};
