import fs from "node:fs";
import path from "node:path";
import { summaryService } from "@/services/summary/interfaces";

export const create = async (userName: string) => {
  const gitDirs: string[] = fs
    .readdirSync("./generated/git")
    .filter((found) => {
      return fs.statSync(path.join(process.cwd(), found)).isDirectory();
    });

  for (const gitDir of gitDirs) {
    await summaryService.create(userName, gitDir);
  }
};
