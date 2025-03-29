import { Link } from "react-router";
import { useState } from "react";

export function Footer() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <footer className="glass border-t border-gray-800 mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* モバイル用ドロップダウンメニュー */}
          <div className="md:hidden w-full mb-4">
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full px-4 py-2 glass rounded-lg border border-gray-700"
            >
              <span className="text-white">Menu</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  showDropdown ? "transform rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="mt-2 glass rounded-lg border border-gray-700 overflow-hidden">
                <Link
                  to="/"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Home
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  History
                </Link>
                <Link
                  to="/terms"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/help"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Help
                </Link>
              </div>
            )}
          </div>

          {/* デスクトップ用ナビゲーション */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-purple-300 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/history"
              className="text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              History
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/help"
              className="text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Help
            </Link>
          </nav>

          {/* 著作権表示 */}
          <div className="text-sm text-gray-400 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Git Resume. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}