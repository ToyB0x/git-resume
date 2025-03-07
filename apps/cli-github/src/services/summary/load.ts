import fs from "node:fs";
import type { Summary } from "@/models";

export const load = (userName: string): Summary[] => {
  const userSummaryDir = `./generated/summaries/${userName}`;
  const ownerDirs: string[] = fs.readdirSync(userSummaryDir);

  const summaries: Summary[] = [];
  for (const ownerDir of ownerDirs) {
    const summaryFiles: string[] = fs.readdirSync(
      `${userSummaryDir}/${ownerDir}`,
    );
    for (const summaryFile of summaryFiles) {
      const markdownFile = fs.readFileSync(
        `${userSummaryDir}/${ownerDir}/${summaryFile}`,
        "utf-8",
      );
      summaries.push(markdownFile.toString());
    }
  }

  return summaries;
};
