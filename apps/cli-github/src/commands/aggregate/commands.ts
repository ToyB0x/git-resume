import { Command } from "commander";
import { aggregateUser } from "./user/aggregateUser";

export const newAggregateCommand = () => {
  const aggregate = new Command("aggregate");
  aggregate.description("aggregate related commands.");

  aggregate
    .command("user")
    .description("aggregate specific user activity")
    .argument("<userName>", "userName to aggregate")
    .argument(
      "<repoVisibility>",
      "repository type to aggregate (public/private)",
    )
    .action(async (userName, repoVisibility) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      if (typeof repoVisibility !== "string")
        throw Error("repoVisibility must be string");
      if (repoVisibility !== "public" && repoVisibility !== "private")
        throw Error("repoVisibility must be public or private");

      await aggregateUser(userName, repoVisibility);
    });

  return aggregate;
};
