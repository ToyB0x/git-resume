import { dbClient, octokitApp } from "@/clients";
import { userTbl } from "@/db";

export const aggregate = async (userName: string) => {
  const res = await octokitApp.request("GET /user/{username}", {
    username: userName,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const user = res.data;

  // TODO: refactor (validate response and typing data)
  const userId = user.data.id as number;
  const avatar_url = user.data.avatar_url as string;
  const name = user.data.name as string | null;
  const blog = user.data.blog as string | null;
  const updated_at = user.data.updated_at as string;

  if (!avatar_url || !updated_at) return;

  await dbClient
    .insert(userTbl)
    .values({
      id: userId,
      login: userName,
      name: name,
      blog: blog,
      avatarUrl: avatar_url,
      updatedAt: new Date(updated_at),
    })
    .onConflictDoUpdate({
      target: userTbl.id,
      set: {
        name: name,
        blog: blog,
        avatarUrl: avatar_url,
        updatedAt: new Date(updated_at),
      },
    });
};
