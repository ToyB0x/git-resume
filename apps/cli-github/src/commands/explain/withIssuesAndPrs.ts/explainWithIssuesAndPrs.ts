import { dbClient } from "@/clients";
import { searchIssuesAndPRsTbl, userTbl } from "@/db";
import { eq } from "drizzle-orm";
import { get_encoding } from "tiktoken";

export const explainWithIssuesAndPrs = async (
  userName: string,
): Promise<void> => {
  const userId = await dbClient
    .select()
    .from(userTbl)
    .where(eq(userTbl.login, userName))
    .get();
  if (!userId) throw new Error("User not found");

  const all = await dbClient
    .select()
    .from(searchIssuesAndPRsTbl)
    .where(eq(searchIssuesAndPRsTbl.authorId, userId.id));

  const allJsonText = JSON.stringify(all);
  console.log(allJsonText);
  console.log("total size", allJsonText.length);

  const enc = get_encoding("gpt2");
  console.log("total tokens", enc.encode(allJsonText).length);
  enc.free();
};
