import { Link } from "react-router";

export function Header() {
  return (
    <header className="glass border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gradient">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Git Resume
            </h1>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="text-white hover:text-purple-300 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="text-gray-400 hover:text-purple-300 transition-all duration-300"
              >
                History
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}