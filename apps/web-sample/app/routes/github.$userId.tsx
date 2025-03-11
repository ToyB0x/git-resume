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

  // In a real implementation, we would fetch the actual resume markdown here
  
  return {
    user,
    userId,
  };
}

// Mock markdown resume data
const mockResumeMarkdown = `# Yuki Hattori

> Full-stack engineer passionate about open source development

## Overview

Experienced software engineer with 8+ years of expertise in web development and cloud infrastructure. Passionate about creating high-performance applications and contributing to open source projects.

## Skills

- **Languages**: JavaScript (9/10), TypeScript (8/10), Python (7/10), Go (6/10)
- **Frontend**: React, Vue.js, Angular, HTML5, CSS3, Tailwind CSS
- **Backend**: Node.js, Express, Hono, Django, FastAPI
- **DevOps**: Docker, Kubernetes, GitHub Actions, CircleCI
- **Cloud**: AWS, GCP, Firebase, Cloudflare

## Project Experience

### survive

**Role**: Maintainer

A GitHub resume generator that analyzes repositories to create professional profiles. Built with TypeScript, React, and Hono.

### web-app

**Role**: Contributor

Modern web application with cutting-edge features built using React, GraphQL, and Tailwind CSS.

### open-source-library

**Role**: Creator

Popular utility library that simplifies common development tasks with zero dependencies.

## Key Strengths

- Strong problem-solving skills with a focus on clean, maintainable code
- Consistent contributions to open-source projects
- Cross-functional team collaboration
- Rapid prototyping and MVP development
- Data-driven approach to performance optimization

---

Generated with GitHub data and AI analysis.`;

// Function to render markdown content with simple styling
function renderMarkdown(markdown: string) {
  // Simple markdown transformer for basic elements
  // Note: In a real app, you would use a proper markdown library
  
  // Process headers
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-200 mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-100 mt-8 mb-3 border-b border-gray-700 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-2">$1</h1>');
  
  // Process blockquotes
  html = html.replace(/^\> (.+$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-300 my-4">$1</blockquote>');
  
  // Process lists
  html = html.replace(/^\- (.+$)/gim, '<li class="ml-6 text-gray-300 list-disc">$1</li>');
  
  // Fix list grouping
  html = html.replace(/<\/li>\n<li/g, '</li><li');
  html = html.replace(/<li class="ml-6 text-gray-300 list-disc">/g, '<ul class="my-3"><li class="ml-6 text-gray-300 list-disc">');
  html = html.replace(/<\/li>\n\n/g, '</li></ul>\n\n');
  html = html.replace(/<\/li>(\s+)<h/g, '</li></ul>\n<h');
  
  // Process bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
  
  // Process horizontal rules
  html = html.replace(/^\-\-\-+/gim, '<hr class="my-6 border-gray-700">');
  
  // Process paragraphs (needs to come last)
  html = html.replace(/^([^<].*)\n$/gim, '<p class="my-3 text-gray-300 leading-relaxed">$1</p>');
  
  // Handle multiple newlines
  html = html.replace(/\n\n/g, '\n');
  
  return html;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;
  const [markdownContent, setMarkdownContent] = useState(mockResumeMarkdown);
  
  // In a real implementation, we would fetch the actual markdown resume data here
  useEffect(() => {
    // Update resume data with the user ID - in reality, this would be an API call
    const updatedMarkdown = mockResumeMarkdown.replace("Yuki Hattori", userId || "GitHub User");
    setMarkdownContent(updatedMarkdown);
  }, [userId]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative overflow-hidden p-4">
      <div className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-8 z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            GitHub <span className="font-extrabold">Resume</span>
          </h1>
          <p className="text-gray-300 mt-3">
            Profile generated from GitHub activity
          </p>
        </header>

        {/* Resume Content (Markdown) */}
        <div className="markdown-content bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div 
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdownContent) }} 
            className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white"
          />
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mt-10 rounded-full" />

        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with GitHub data and AI generation
        </footer>
      </div>
    </main>
  );
}
