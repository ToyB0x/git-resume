import { step } from "@/utils";
// import { aggregate as aggregateRepositories } from "./repositories";
import { aggregate as aggregateSearchIssuesAndPRs } from "./searchIssuesAndPRs";
import { aggregate as aggregateUserDetail } from "./userDetail";

export const aggregateUser = async (userName: string): Promise<void> => {
  // await step({
  //   stepName: "aggregate:repository",
  //   callback: aggregateRepositories(userName),
  // });

  await step({
    stepName: "aggregate:user",
    callback: aggregateUserDetail(userName),
  });

  await step({
    stepName: "aggregate:searchIssuesAndPRs",
    callback: aggregateSearchIssuesAndPRs(userName),
  });
};
