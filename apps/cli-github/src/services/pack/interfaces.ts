import type { Pack } from "@resume/models";
import { create } from "./create";
import { load } from "./load";

interface PackService {
  create: (userName: string, gitDir: string) => Promise<void>;
  load: (userName: string) => Pack[];
}

export const packService: PackService = {
  create: create,
  load: load,
};
