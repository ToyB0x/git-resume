import { create } from "./create";

interface PackService {
  create: (userName: string, gitDir: string) => Promise<void>;
}

export const packService: PackService = {
  create: create,
};
