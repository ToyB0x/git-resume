import fs from "node:fs";
import { packService } from "@/services/pack/interfaces";

export const create = async (userName: string) => {
  const dir = "./generated/git";
  const orgDirs: string[] = fs.readdirSync(dir);

  for (const orgDir of orgDirs) {
    const repoDirs: string[] = fs.readdirSync(`${dir}/${orgDir}`);
    for (const repoDir of repoDirs) {
      await packService.create(userName, `${dir}/${orgDir}/${repoDir}`);
    }
  }
};
