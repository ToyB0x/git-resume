import { step } from "@/utils";
// import { aggregate as aggregatePrDiff } from "./pr";
import { aggregate as aggregateRepositoryClone } from "./cloneRepositories";
import { aggregate as aggregateSearchCommits } from "./searchCommits";
// import { aggregate as aggregateSearchIssuesAndPRs } from "./searchIssuesAndPRs";
import { aggregate as aggregateUserDetail } from "./userDetail";
// import { aggregate as aggregateRepositories } from "./repositories";

export const aggregateUser = async (
  userName: string,
  repoVisibility: "public" | "private",
): Promise<void> => {
  // await step({
  //   stepName: "aggregate:repository",
  //   callback: aggregateRepositories(userName),
  // });

  await step({
    stepName: "aggregate:user",
    callback: aggregateUserDetail(userName),
  });

  // await step({
  //   stepName: "aggregate:searchIssuesAndPRs",
  //   callback: aggregateSearchIssuesAndPRs(userName, repoVisibility),
  // });
  //
  // await step({
  //   stepName: "aggregate:pr-diff",
  //   callback: aggregatePrDiff(userName, repoVisibility),
  // });

  await step({
    stepName: "aggregate:searchCommits",
    callback: aggregateSearchCommits(userName, repoVisibility),
  });

  await step({
    stepName: "aggregate:repository-clone",
    callback: aggregateRepositoryClone(userName, repoVisibility),
  });
};
