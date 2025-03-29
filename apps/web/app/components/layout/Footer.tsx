import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="glass border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Git Resume. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/terms"
              className="text-sm text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/help"
              className="text-sm text-gray-400 hover:text-purple-300 transition-all duration-300"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}