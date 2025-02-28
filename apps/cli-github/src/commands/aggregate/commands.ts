import { Command } from "commander";
import { aggregateUser } from "./user/aggregateUser";

export const newAggregateCommand = () => {
  const aggregate = new Command("aggregate");
  aggregate.description("aggregate related commands.");

  aggregate
    .command("user")
    .description("aggregate specific user activity")
    .argument("<userName>", "userName to aggregate")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await aggregateUser(userName);
    });

  return aggregate;
};
