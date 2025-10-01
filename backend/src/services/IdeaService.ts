import { IdeaRepository } from '../repositories/IdeaRepository';
import { Idea, IdeaWithVotes, CreateIdeaRequest, VoteRequest, ApiResponse } from '../types';

export class IdeaService {
  constructor(private ideaRepository: IdeaRepository) {}

  async getAllIdeas(ipAddress: string): Promise<ApiResponse<IdeaWithVotes[]>> {
    try {
      const ideas = await this.ideaRepository.getAllIdeasWithVotes();
      const userVotes = await this.ideaRepository.getUserVotes(ipAddress);
      const userVotedIdeaIds = new Set(userVotes.map(vote => vote.ideaId));

      const ideasWithVotes: IdeaWithVotes[] = ideas.map(idea => ({
        ...idea,
        votesCount: idea._count?.votes || 0,
        hasVoted: userVotedIdeaIds.has(idea.id)
      }));

      return {
        success: true,
        data: ideasWithVotes
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении списка идей'
      };
    }
  }

  async getIdeaById(id: string, ipAddress: string): Promise<ApiResponse<IdeaWithVotes>> {
    try {
      const idea = await this.ideaRepository.getIdeaById(id);
      
      if (!idea) {
        return {
          success: false,
          error: 'Идея не найдена'
        };
      }

      const hasVoted = await this.ideaRepository.hasUserVotedForIdea(id, ipAddress);
      
      const ideaWithVotes: IdeaWithVotes = {
        ...idea,
        votesCount: idea._count?.votes || 0,
        hasVoted
      };

      return {
        success: true,
        data: ideaWithVotes
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении идеи'
      };
    }
  }

  async createIdea(ideaData: CreateIdeaRequest): Promise<ApiResponse<Idea>> {
    try {
      const idea = await this.ideaRepository.createIdea(ideaData.title, ideaData.description);
      
      return {
        success: true,
        data: idea,
        message: 'Идея успешно создана'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при создании идеи'
      };
    }
  }

  async voteForIdea(voteData: VoteRequest, ipAddress: string): Promise<ApiResponse> {
    try {
      // Проверяем, существует ли идея
      const idea = await this.ideaRepository.getIdeaById(voteData.ideaId);
      if (!idea) {
        return {
          success: false,
          error: 'Идея не найдена'
        };
      }

      // Проверяем, не голосовал ли пользователь уже за эту идею
      const hasVoted = await this.ideaRepository.hasUserVotedForIdea(voteData.ideaId, ipAddress);
      if (hasVoted) {
        return {
          success: false,
          error: 'Вы уже голосовали за эту идею'
        };
      }

      // Проверяем лимит голосов (максимум 10)
      const userVotesCount = await this.ideaRepository.getUserVotesCount(ipAddress);
      if (userVotesCount >= 10) {
        return {
          success: false,
          error: 'Вы исчерпали лимит голосов (максимум 10)'
        };
      }

      // Голосуем за идею
      await this.ideaRepository.voteForIdea(voteData.ideaId, ipAddress);

      return {
        success: true,
        message: 'Ваш голос засчитан'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при голосовании'
      };
    }
  }

  async getUserVotesInfo(ipAddress: string): Promise<ApiResponse<{ votesCount: number; maxVotes: number }>> {
    try {
      const votesCount = await this.ideaRepository.getUserVotesCount(ipAddress);
      
      return {
        success: true,
        data: {
          votesCount,
          maxVotes: 10
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении информации о голосах'
      };
    }
  }
}

