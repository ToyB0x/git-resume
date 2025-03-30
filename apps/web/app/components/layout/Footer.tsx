import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="glass border-t border-gray-800 mt-auto py-4">
      <div className="container mx-auto px-4">
        {/* ナビゲーションメニュー - 中央寄せで、横幅に収まりきらない項目は縦に折り返す */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
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
        <div className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Git Resume. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
