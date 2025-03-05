import { Command } from "commander";
import { packWithIssuesAndPrs } from "./withIssuesAndPrs";
import { packWithPrDiffs } from "./withPrDiffs";

export const newPackCommand = () => {
  const pack = new Command("pack");
  pack.description("pack related commands.");

  pack
    .command("issue-and-pr")
    .description("pack user by issues and prs")
    .argument("<userName>", "userName to pack")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await packWithIssuesAndPrs(userName);
    });

  pack
    .command("pr-diff")
    .description("pack user by pr diffs")
    .argument("<userName>", "userName to pack")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await packWithPrDiffs(userName);
    });

  return pack;
};
