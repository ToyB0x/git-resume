/**
 * Types representing different progress states during the resume generation process
 */

/**
 * Git search commit progress state
 */
export type GitSearchState = {
  type: 'GitSearch';
  foundCommits?: number;
  foundRepositories?: number;
};

/**
 * Git clone progress state
 */
export type GitCloneState = {
  type: 'GitClone';
  repository: string;
  current: number;
  total: number;
};

/**
 * Repository analysis progress state
 */
export type AnalyzeState = {
  type: 'Analyze';
  repository: string;
  current: number;
  total: number;
};

/**
 * Summary creation progress state
 */
export type CreateSummaryState = {
  type: 'CreateSummary';
  repository?: string;
  current: number;
  total: number;
};

/**
 * Resume creation progress state
 */
export type CreatingResumeState = {
  type: 'CreatingResume';
};

/**
 * Union type of all possible states
 */
export type ResumeGenerationState =
  | GitSearchState
  | GitCloneState
  | AnalyzeState
  | CreateSummaryState
  | CreatingResumeState;