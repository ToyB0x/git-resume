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

// 調査進行状況のモックデータ
export interface ResearchProgress {
  overallProgress: number;
  steps: ResearchStepStatus[];
  currentStep: string;
}

export interface ResearchStepStatus {
  id: number;
  name: string;
  status: "completed" | "in-progress" | "waiting";
  progress?: number | undefined;
  details?: string | undefined;
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

export function getMockResearchPlan(username: string): ResearchPlan {
  const repositoryCount =
    username === "octocat" ? 8 : Math.floor(Math.random() * 30) + 5;

  return {
    steps: [
      {
        id: 1,
        name: "Repository Search",
        description: "Search for repositories committed to in the past year",
      },
      {
        id: 2,
        name: "Repository Clone",
        description: `Clone about ${repositoryCount} repositories based on search results`,
      },
      {
        id: 3,
        name: "Repository Activity Analysis",
        description: "Analyze commit content in each repository in detail",
      },
      {
        id: 4,
        name: "Resume Creation",
        description:
          "Generate a resume in Markdown format from analysis results",
      },
    ],
    estimatedTime: repositoryCount * 1, // 1分/リポジトリと仮定
    repositoryCount,
  };
}

export function getMockResearchProgress(username: string, stage = 0) {
  const steps: ResearchStepStatus[] = [
    {
      id: 1,
      name: "Repository Search",
      status: stage >= 1 ? "completed" : "waiting",
    },
    {
      id: 2,
      name: "Repository Clone",
      status: stage === 2 ? "in-progress" : stage > 2 ? "completed" : "waiting",
      progress: stage === 2 ? 45 : undefined,
    },
    {
      id: 3,
      name: "Repository Activity Analysis",
      status: stage === 3 ? "in-progress" : stage > 3 ? "completed" : "waiting",
    },
    {
      id: 4,
      name: "Resume Creation",
      status: stage === 4 ? "in-progress" : stage > 4 ? "completed" : "waiting",
    },
  ];

  const currentStepMap: Record<number, string> = {
    0: "Not started",
    1: "Repository Search",
    2: "Repository Clone",
    3: "Repository Activity Analysis",
    4: "Resume Creation",
    5: "Complete",
  };

  return {
    overallProgress: Math.min(100, stage * 20),
    steps,
    currentStep: currentStepMap[stage] || "Not started",
  };
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
