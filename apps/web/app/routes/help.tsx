import { useState } from "react";
import { Link } from "react-router";
import { Layout } from "../components/layout/Layout";
import type { Route } from "./+types/help";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Help & Support - Git Resume" },
    { name: "description", content: "Help and support for Git Resume" },
  ];
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"guide" | "faq" | "contact">(
    "guide",
  );

  return (
    <Layout>
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gradient">
            Help & Support
          </h2>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "guide"
                  ? "text-white tab-active"
                  : "text-gray-400 hover:text-white transition-all duration-300"
              }`}
              onClick={() => setActiveTab("guide")}
            >
              User Guide
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "faq"
                  ? "text-white tab-active"
                  : "text-gray-400 hover:text-white transition-all duration-300"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "contact"
                  ? "text-white tab-active"
                  : "text-gray-400 hover:text-white transition-all duration-300"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contact
            </button>
          </div>

          {/* User Guide */}
          {activeTab === "guide" && (
            <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Basic Usage of Git Resume
              </h3>

              <div className="space-y-6">
                <div className="glass rounded-lg p-5 border border-gray-800">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-2">
                        Enter GitHub Username
                      </h4>
                      <p className="text-gray-300">
                        Enter a GitHub username on the home screen and click the
                        "Start Research" button.
                      </p>
                      <div className="mt-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <p className="text-sm text-gray-400">
                          Tip: You can analyze any GitHub username with a public
                          profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-2">
                        Review Research Plan
                      </h4>
                      <p className="text-gray-300">
                        Basic information and research plan for the entered
                        GitHub username will be displayed. Review the content
                        and click the "Execute Research" button to start
                        detailed analysis.
                      </p>
                      <div className="mt-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <p className="text-sm text-gray-400">
                          Tip: At this stage, only lightweight information is
                          retrieved, so results are displayed within 10 seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-2">
                        Check Research Progress
                      </h4>
                      <p className="text-gray-300">
                        The progress of detailed analysis is displayed in
                        real-time. This process runs in the background, so you
                        can safely leave the screen at any time.
                      </p>
                      <div className="mt-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <p className="text-sm text-gray-400">
                          Tip: Analysis may take from a few minutes to tens of
                          minutes depending on the number of repositories.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-2">View Results</h4>
                      <p className="text-gray-300">
                        When the analysis is complete, a resume in Markdown
                        format will be displayed. You can save it in PDF or text
                        format using the "Export" button, or share the results
                        using the "Share" button.
                      </p>
                      <div className="mt-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <p className="text-sm text-gray-400">
                          Tip: Analysis results are stored for 30 days and will
                          be displayed immediately when searching for the same
                          username again.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-6">
                <div className="glass rounded-lg p-5 border border-gray-800">
                  <h4 className="font-medium text-lg mb-2">
                    What information is used to generate the resume?
                  </h4>
                  <p className="text-gray-300">
                    Git Resume analyzes public GitHub repositories, commits, and
                    contributions to generate a comprehensive resume. Only
                    publicly available information is used.
                  </p>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <h4 className="font-medium text-lg mb-2">
                    How long does the analysis take?
                  </h4>
                  <p className="text-gray-300">
                    The analysis time depends on the number of repositories and
                    the amount of activity. Typically, it takes about 1 minute
                    per repository.
                  </p>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <h4 className="font-medium text-lg mb-2">
                    Can I customize the generated resume?
                  </h4>
                  <p className="text-gray-300">
                    Currently, the resume is generated automatically based on
                    the GitHub activity. Customization features will be added in
                    future updates.
                  </p>
                </div>

                <div className="glass rounded-lg p-5 border border-gray-800">
                  <h4 className="font-medium text-lg mb-2">
                    How long are the results stored?
                  </h4>
                  <p className="text-gray-300">
                    The generated resumes are stored for 30 days. After that,
                    you'll need to run the analysis again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === "contact" && (
            <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>

              <p className="text-gray-300 mb-6">
                If you have any questions, feedback, or issues, please feel free
                to contact us using the form below or through our social media
                channels.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <button
                  type="button"
                  className="btn-gradient text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}

          {/* Support Information */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Support Information</h3>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="glass rounded-lg p-5 border border-gray-800 flex-1">
                <h4 className="font-medium text-lg mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>FAQ</title>
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Frequently Asked Questions
                </h4>
                <p className="text-gray-300 mb-3">
                  You can check answers to common questions.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("faq")}
                  className="text-blue-400 hover:text-blue-300 transition-all duration-300 inline-flex items-center"
                >
                  View FAQ
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Arrow Right</title>
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="glass rounded-lg p-5 border border-gray-800 flex-1">
                <h4 className="font-medium text-lg mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Contact</title>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Contact Us
                </h4>
                <p className="text-gray-300 mb-3">
                  If you have any questions or issues, please feel free to
                  contact us.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("contact")}
                  className="text-blue-400 hover:text-blue-300 transition-all duration-300 inline-flex items-center"
                >
                  Contact Form
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Arrow Right</title>
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="glass rounded-lg p-5 border border-gray-800 flex-1">
                <h4 className="font-medium text-lg mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Latest Information</title>
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Latest Information
                </h4>
                <p className="text-gray-300 mb-3">
                  You can check new features and update information.
                </p>
                <Link
                  to="/"
                  className="text-blue-400 hover:text-blue-300 transition-all duration-300 inline-flex items-center"
                >
                  View News
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Arrow Right</title>
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
