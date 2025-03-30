import type { GitHubUser } from "../../data/mockData";

interface UserInfoCardProps {
  user: GitHubUser;
  showLocation?: boolean;
  showProfileLink?: boolean;
  additionalInfo?: React.ReactNode;
  className?: string;
}

export function UserInfoCard({
  user,
  showLocation = false,
  showProfileLink = false,
  additionalInfo,
  className = "",
}: UserInfoCardProps) {
  return (
    <div
      className={`glass rounded-xl border border-gray-800 shadow-xl px-6 py-4 mb-6 ${className}`}
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
              {(showLocation || showProfileLink) && (
                <div className="flex items-center mt-1">
                  {user.location && showLocation && (
                    <span className="text-sm text-gray-400 flex items-center mr-4">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Location</title>
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {user.location}
                    </span>
                  )}
                  {showProfileLink && (
                    <span className="text-sm text-gray-400 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>GitHub Profile</title>
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href={user.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors"
                      >
                        {user.profileUrl}
                      </a>
                    </span>
                  )}
                </div>
              )}
            </div>
            {additionalInfo && (
              <div className="text-sm text-gray-400">{additionalInfo}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
