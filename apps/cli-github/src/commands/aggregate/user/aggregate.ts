import { dbClient, octokitApp } from "@/clients";
import { userTbl } from "@/db";

export const aggregate = async (userName: string) => {
  const res = await octokitApp.rest.users.getByUsername({
    username: userName,
  });

  const user = res.data;

  await dbClient
    .insert(userTbl)
    .values({
      id: user.id,
      login: userName,
      name: user.name,
      blog: user.blog,
      avatarUrl: user.avatar_url,
      updatedAt: new Date(user.updated_at),
    })
    .onConflictDoUpdate({
      target: userTbl.id,
      set: {
        name: user.name,
        blog: user.blog,
        avatarUrl: user.avatar_url,
        updatedAt: new Date(user.updated_at),
      },
    });
};
