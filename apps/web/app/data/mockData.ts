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

export function getMockResumeResult(username: string): ResumeResult {
  return {
    markdown: `# ${username.charAt(0).toUpperCase() + username.slice(1)} - GitHub Developer Resume

## Profile Overview

Software developer with experience in open source development. Through activities in the GitHub community, I have contributed to diverse projects. I am passionate about building high-quality software and collaborating with other developers.

## Technical Skills

- **Programming Languages:** JavaScript, TypeScript, Python, Go
- **Frameworks:** React, Node.js, Express, Django
- **Tools:** Git, Docker, Kubernetes, GitHub Actions
- **Cloud:** AWS, Azure, Google Cloud Platform

## Key Projects

### Project 1

Description of project 1 and contributions.

### Project 2

Description of project 2 and contributions.

## Open Source Contributions

Contributed to various open source repositories, focusing on bug fixes, documentation improvements, and new features.

## Communication and Collaboration

Active participant in the developer community, focusing on effective communication and collaboration.

## Future Goals

Continuing to improve skills and contribute to the open source community.
`,
    completedAt: new Date().toISOString(),
  };
}
