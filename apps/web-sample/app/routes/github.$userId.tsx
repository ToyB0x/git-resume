import { useEffect, useState } from "react";
import { hClient } from "~/clients";
import type { Route } from "./+types/github.$userId";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Resume" },
    { name: "description", content: "View GitHub user resume" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const userId = params.userId;

  const userResponse = await hClient.api.github[":userName"].$get({
    param: {
      userName: userId || "test1",
    },
  });

  if (!userResponse.ok) throw Error("Failed to fetch user data");

  const user = await userResponse.json();

  // In a real implementation, we would fetch the actual resume data here
  // For now we're using mock data to demonstrate the UI

  return {
    user,
    userId,
  };
}

// Mock resume data structure
const mockResumeData = {
  name: "GitHub User",
  avatarUrl:
    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  bio: "Software Developer passionate about open source",
  overview:
    "Experienced developer with a focus on web technologies and cloud infrastructure.",
  skills: [
    { name: "JavaScript", level: 9 },
    { name: "TypeScript", level: 8 },
    { name: "React", level: 8 },
    { name: "Node.js", level: 7 },
    { name: "Python", level: 6 },
  ],
  experience: [
    {
      project: "survive",
      role: "Maintainer",
      description:
        "A GitHub resume generator that analyzes your repositories to create a professional profile.",
      technologies: ["TypeScript", "React", "Hono"],
    },
    {
      project: "web-app",
      role: "Contributor",
      description: "Modern web application with cutting-edge features.",
      technologies: ["React", "GraphQL", "Tailwind CSS"],
    },
  ],
  strengths: [
    "Strong problem-solving skills",
    "Consistent contribution to open-source",
    "Cross-functional team collaboration",
  ],
};

// SkillBar component to visualize skill levels
function SkillBar({ skill, level }: { skill: string; level: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-gray-300">{skill}</span>
        <span className="text-gray-400">{level}/10</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
          style={{ width: `${level * 10}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;
  const [resume, setResume] = useState(mockResumeData);

  // In a real implementation, we would fetch the actual resume data here
  useEffect(() => {
    // Update resume data with the user ID
    setResume({
      ...mockResumeData,
      name: userId || "GitHub User",
    });
  }, [userId]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative overflow-hidden p-4">
      <div className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-8 z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            GitHub <span className="font-extrabold">Resume</span>
          </h1>
          <p className="text-gray-300 mt-3">
            Professional profile generated from GitHub activity
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-2 border-purple-500 p-1 mb-4">
                <img
                  src={resume.avatarUrl}
                  alt={`${resume.name}'s avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {resume.name}
              </h2>
              <p className="text-gray-300 text-center mb-6">{resume.bio}</p>

              <div className="w-full">
                <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                  Skills
                </h3>
                <div className="space-y-3">
                  {resume.skills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill.name}
                      level={skill.level}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resume Content Section */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                  Overview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {resume.overview}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                  Project Experience
                </h3>
                <div className="space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-4 py-1"
                    >
                      <h4 className="text-lg font-medium text-white">
                        {exp.project}
                      </h4>
                      <p className="text-purple-400 text-sm">{exp.role}</p>
                      <p className="text-gray-300 mt-2">{exp.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                  Key Strengths
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {resume.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mt-10 rounded-full" />

        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with GitHub data and AI generation
        </footer>
      </div>
    </main>
  );
}
