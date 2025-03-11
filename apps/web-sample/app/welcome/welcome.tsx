import { useState } from "react";

export function Welcome() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the GitHub username search
    alert(`Searching for: ${username}`);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-w-md w-full p-8 z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            GitHub <span className="font-extrabold">Check</span>
          </h1>
          <p className="text-gray-300 mt-3">
            Enter a GitHub username to explore their profile
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-md blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-gray-400 w-5 h-5"
                aria-labelledby="githubIconTitle"
              >
                <title id="githubIconTitle">GitHub Icon</title>
                <path
                  d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
            className="relative w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-300 group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-md" />
            <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-50 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-md transition-opacity" />
            <span className="relative">Search</span>
          </button>
        </form>

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mt-10 rounded-full" />

        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with Gemini Flash 2.0
        </footer>
      </div>
    </main>
  );
}
