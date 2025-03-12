import type { Pack } from "@resume/models";

export interface PackService {
  create: (userName: string, gitDir: string) => Promise<void>;
  load: (userName: string) => Pack[];
}
