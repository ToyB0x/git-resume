import type { GitHubUser } from "../../data/mockData";

interface UserInfoCardProps {
  user: GitHubUser;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <div
      className={
        "glass rounded-xl border border-gray-800 shadow-xl px-6 py-4 mb-6"
      }
    >
      <div className="flex items-center">
        <img
          src={user.avatarUrl}
          alt={`${user.name}'s GitHub Avatar`}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl text-gray-300 font-bold">
                {user.username}
              </h2>
              <p className="text-gray-300">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
