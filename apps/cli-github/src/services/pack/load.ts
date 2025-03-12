import fs from "node:fs";
import type { Pack } from "@resume/models";

export const load = (userName: string): Pack[] => {
  const userPackDir = `./generated/pack/${userName}`;
  const ownerDirs: string[] = fs.readdirSync(userPackDir);

  const packs: Pack[] = [];
  for (const ownerDir of ownerDirs) {
    const repoFiles: string[] = fs.readdirSync(`${userPackDir}/${ownerDir}`);
    for (const repoFile of repoFiles) {
      const packFile = fs.readFileSync(
        `${userPackDir}/${ownerDir}/${repoFile}`,
        "utf-8",
      );
      packs.push({
        meta: {
          owner: ownerDir,
          repo: repoFile.replace(".txt", ""),
        },
        body: packFile.toString(),
      });
    }
  }

  return packs;
};
