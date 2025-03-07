export type Summary = {
  meta: {
    organization: string;
    repository: string;
    isPrivate: boolean;
    summaryStartAt: Date;
    summaryEndAt: Date;
  };
  // languages: string[];
  // frameworks: string[];
  // libraries: string[];
  body: string;
};
