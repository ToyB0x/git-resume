import type { Pack } from "@/models";
import { create } from "./create";

interface PackService {
  create: (userName: string, gitDir: string) => Promise<void>;
  load: (userName: string) => Promise<Pack[]>;
}

export const packService: PackService = {
  create: create,
  load: async (userName: string) => {
    throw Error("not implemented: " + userName);
  },
};
