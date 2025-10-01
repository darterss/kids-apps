export interface Idea {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    votes: number;
  };
}

export interface IdeaWithVotes extends Idea {
  votesCount: number;
  hasVoted?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VoteRequest {
  ideaId: string;
}

export interface UserVotesInfo {
  votesCount: number;
  maxVotes: number;
}

