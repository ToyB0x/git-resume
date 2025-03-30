import fs from "node:fs";
import { packService } from "@resume/services";

export const pack = async (userName: string) => {
  const dir = "./generated/git";
  const orgDirs: string[] = fs.readdirSync(dir);

  for (const orgDir of orgDirs) {
    const repoDirs: string[] = fs.readdirSync(`${dir}/${orgDir}`);
    for (const repoDir of repoDirs) {
      const gitRepoDir = `${dir}/${orgDir}/${repoDir}`;

      // avoid .DS_Store files (errors on Mac)
      if (gitRepoDir.endsWith(".DS_Store")) continue;

      await packService.create(userName, gitRepoDir);
    }
  }
};
