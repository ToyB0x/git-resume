import { Command } from "commander";
import { generateResume } from "./resume";

export const newGenerateCommand = () => {
  const generate = new Command("generate");
  generate.description("generate related commands.");

  generate
    .command("resume")
    .description("generate user resume")
    .argument("<userName>", "userName to generate resume")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await generateResume(userName);
    });

  return generate;
};
