// GitHub ユーザーの基本情報のモックデータ
export interface GitHubUser {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  profileUrl: string;
  repositories: number;
}

// 調査計画のモックデータ
export interface ResearchPlan {
  steps: ResearchStep[];
  estimatedTime: number;
  repositoryCount: number;
}

export interface ResearchStep {
  id: number;
  name: string;
  description: string;
}

export interface ResearchStepStatus {
  id: number;
  name: string;
  description: string;
  progress: number; // 開始前は0
  isActive: boolean; // 現在進行中のステップかどうか
}

// レジュメ結果のモックデータ
export interface ResumeResult {
  markdown: string;
  completedAt: string;
}

// モックデータの生成
export function getMockUser(username: string): GitHubUser {
  return {
    username,
    name:
      username === "octocat"
        ? "The Octocat"
        : `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
    avatarUrl:
      username === "octocat"
        ? "https://avatars.githubusercontent.com/u/583231"
        : `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000000)}`,
    bio: username === "octocat" ? "The GitHub Mascot" : "GitHub User",
    location: username === "octocat" ? "San Francisco" : "Earth",
    profileUrl: `https://github.com/${username}`,
    repositories:
      username === "octocat" ? 8 : Math.floor(Math.random() * 30) + 5,
  };
}

export function getMockResearchPlan(): ResearchPlan {
  return {
    steps: [
      {
        id: 1,
        name: "Search Repository",
        description: "Find user's committed repositories",
      },
      {
        id: 2,
        name: "Clone Repository",
        description: "Clone repositories based on search results",
      },
      {
        id: 3,
        name: "Code Analysis",
        description: "Analyze commits in each repository in detail",
      },
      {
        id: 4,
        name: "Resume Creation",
        description: "Generate a resume from analysis results",
      },
    ],
    estimatedTime: 11,
    repositoryCount: 11,
  };
}

export function getMockResearchProgress() {
  const steps: ResearchStepStatus[] = [
    {
      id: 1,
      name: "Search Repository",
      description: "Find user's committed repositories",
      progress: 100,
      isActive: false,
    },
    {
      id: 2,
      name: "Clone Repository",
      description: "Clone repositories based on search results",
      progress: 23,
      isActive: true,
    },
    {
      id: 3,
      name: "Code Analysis",
      description: "Analyze commits in each repository in detail",
      progress: 0,
      isActive: false,
    },
    {
      id: 4,
      name: "Resume Creation",
      description: "Generate a resume from analysis results",
      progress: 0,
      isActive: false,
    },
  ];

  return steps;
}

export function getMockResumeResult(): ResumeResult {
  return {
    markdown: `# Yuki Hattori

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

Generated with GitHub data and AI analysis.`,
    completedAt: new Date().toISOString(),
  };
}
