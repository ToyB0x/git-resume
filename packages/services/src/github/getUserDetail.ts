import type { User } from "@resume/models";
import type { getOctokit } from "./client";

export const getUserDetail = async (
  userName: string,
  octokitApp: ReturnType<typeof getOctokit>,
): Promise<User> => {
  const res = await octokitApp.rest.users.getByUsername({
    username: userName,
  });

  const user = res.data;

  return {
    id: user.id,
    userName: user.login,
    displayName: user.name,
    blog: user.blog,
    avatarUrl: user.avatar_url,
  };
};
