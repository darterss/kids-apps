import axios from 'axios';
import { IdeaWithVotes, ApiResponse, VoteRequest, UserVotesInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const ideasApi = {
  // Получить все идеи
  async getAllIdeas(): Promise<ApiResponse<IdeaWithVotes[]>> {
    const response = await apiClient.get('/ideas');
    return response.data;
  },

  // Получить идею по ID
  async getIdeaById(id: string): Promise<ApiResponse<IdeaWithVotes>> {
    const response = await apiClient.get(`/ideas/${id}`);
    return response.data;
  },

  // Проголосовать за идею
  async voteForIdea(voteData: VoteRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/ideas/vote', voteData);
    return response.data;
  },

  // Получить информацию о голосах пользователя
  async getUserVotesInfo(): Promise<ApiResponse<UserVotesInfo>> {
    const response = await apiClient.get('/ideas/user/votes');
    return response.data;
  },
};
