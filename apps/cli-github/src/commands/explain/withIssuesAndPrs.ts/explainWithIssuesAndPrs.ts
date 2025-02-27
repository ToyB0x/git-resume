import { getDbClient } from "@/clients";
import { searchIssuesAndPRsTbl } from "@/db";

export const explainWithIssuesAndPrs = async (
  userName: string,
): Promise<void> => {
  const all = await getDbClient(userName).select().from(searchIssuesAndPRsTbl);

  const allJsonText = JSON.stringify(all);
  console.log(allJsonText);
  console.log("total size", allJsonText.length);
};
