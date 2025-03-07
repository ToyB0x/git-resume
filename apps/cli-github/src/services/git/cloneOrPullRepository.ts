import fs from "node:fs";
import type { Repository } from "@/models";
import { simpleGit } from "simple-git";

export const cloneOrPullRepository = async (repository: Repository) => {
  const targetDir = `./generated/git/${repository.owner}/${repository.name}`;
  const isExistRepo = fs.existsSync(targetDir);

  if (isExistRepo) {
    await simpleGit({ baseDir: targetDir }).pull();
  } else {
    await simpleGit().clone(
      `git@github.com:${repository.owner}/${repository.name}.git`,
      targetDir,
    );
  }
};
