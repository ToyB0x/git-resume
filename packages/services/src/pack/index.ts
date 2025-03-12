import { create } from "./create";
import type { PackService } from "./interfaces";
import { load } from "./load";

export const packService: PackService = {
  create: create,
  load: load,
};
