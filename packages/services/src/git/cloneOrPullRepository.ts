import fs from "node:fs";
import type { Repository } from "@resume/models";
import { simpleGit } from "simple-git";

export const cloneOrPullRepository = async (repository: Repository) => {
  const targetDir = `./generated/git/${repository.owner}/${repository.name}`;
  const isExistRepo = fs.existsSync(targetDir);

  if (isExistRepo) {
    await simpleGit({ baseDir: targetDir }).pull();
  } else {
    await simpleGit().clone(
      `https://github.com/${repository.owner}/${repository.name}.git`,
      targetDir,
      ["--no-checkout"],
    );
  }
};
