export interface Idea {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    votes: number;
  };
}

export interface Vote {
  id: string;
  ipAddress: string;
  ideaId: string;
  createdAt: Date;
}

export interface IdeaWithVotes extends Idea {
  votesCount: number;
  hasVoted?: boolean; 
}

export interface CreateIdeaRequest {
  title: string;
  description?: string;
}

export interface VoteRequest {
  ideaId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

