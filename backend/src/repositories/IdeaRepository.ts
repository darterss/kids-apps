import { PrismaClient } from '@prisma/client';
import { Idea, Vote } from '../types';

export class IdeaRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllIdeasWithVotes(): Promise<Idea[]> {
    return this.prisma.idea.findMany({
      include: {
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      }
    });
  }

  async getIdeaById(id: string): Promise<Idea | null> {
    return this.prisma.idea.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            votes: true
          }
        }
      }
    });
  }

  async createIdea(title: string, description?: string): Promise<Idea> {
    return this.prisma.idea.create({
      data: {
        title,
        description
      },
      include: {
        _count: {
          select: {
            votes: true
          }
        }
      }
    });
  }

  async voteForIdea(ideaId: string, ipAddress: string): Promise<Vote> {
    return this.prisma.vote.create({
      data: {
        ideaId,
        ipAddress
      }
    });
  }

  async hasUserVotedForIdea(ideaId: string, ipAddress: string): Promise<boolean> {
    const vote = await this.prisma.vote.findUnique({
      where: {
        ipAddress_ideaId: {
          ipAddress,
          ideaId
        }
      }
    });
    return !!vote;
  }

  async getUserVotesCount(ipAddress: string): Promise<number> {
    return this.prisma.vote.count({
      where: {
        ipAddress
      }
    });
  }

  async getUserVotes(ipAddress: string): Promise<Vote[]> {
    return this.prisma.vote.findMany({
      where: {
        ipAddress
      },
      include: {
        idea: true
      }
    });
  }
}

