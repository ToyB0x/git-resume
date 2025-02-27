import { step } from "@/utils";
import { aggregate as aggregateRepositories } from "./repositories";

export const aggregateUser = async (userName: string): Promise<void> => {
  await step({
    stepName: "aggregate:repository",
    callback: aggregateRepositories(userName),
  });
};
