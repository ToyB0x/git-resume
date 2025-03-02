import { Command } from "commander";
import { explainWithIssuesAndPrs } from "./withIssuesAndPrs";
import { explainWithPrDiffs } from "./withPrDiffs";

export const newExplainCommand = () => {
  const explain = new Command("explain");
  explain.description("explain related commands.");

  explain
    .command("issue-and-pr")
    .description("explain user by issues and prs")
    .argument("<userName>", "userName to explain")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await explainWithIssuesAndPrs(userName);
    });

  explain
    .command("pr-diff")
    .description("explain user by pr diffs")
    .argument("<userName>", "userName to explain")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await explainWithPrDiffs(userName);
    });

  return explain;
};
