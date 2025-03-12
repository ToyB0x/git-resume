import type { User } from "@resume/models";
import { octokitApp } from "./client";

export const getUserDetail = async (userName: string): Promise<User> => {
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
