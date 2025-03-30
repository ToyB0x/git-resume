import { useState } from "react";
import { useNavigate } from "react-router";
import { GithubIcon } from "~/components/ui/GithubIcon";
import { HR } from "~/components/ui/HR";
import { Card } from "../components/ui/Card";

export function Welcome() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/github/${username}/plan`);
    }
  };

  return (
    <Card padding="p-8" maxWidth="max-w-md" width="w-full">
      {/* Logo and message */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gradient w-fit mx-auto">
          Git Resume
        </h1>
        <p className="text-gray-300 mt-3">
          Enter a GitHub username to explore the profile
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div className="relative group">
          {/* border color */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-md blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

          {/* form left icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <GithubIcon />
          </div>

          {/* form input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="github username"
            className="relative block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex-1 btn-gradient text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
        >
          Search
        </button>
      </form>

      <div className="mt-8">
        <HR />
        <p className="text-sm text-gray-400 text-center mt-4">
          Proceed to research planning
        </p>
      </div>
    </Card>
  );
}
