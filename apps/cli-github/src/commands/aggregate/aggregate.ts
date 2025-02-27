import { step } from "@/utils";
// import { aggregate as aggregateRepositories } from "./repositories";
import { aggregate as agegateSearchIssuesAndPRs } from "./searchIssuesAndPRs";

export const aggregateUser = async (userName: string): Promise<void> => {
  // await step({
  //   stepName: "aggregate:repository",
  //   callback: aggregateRepositories(userName),
  // });

  await step({
    stepName: "aggregate:searchIssuesAndPRs",
    callback: agegateSearchIssuesAndPRs(userName),
  });
};
