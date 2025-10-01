import { Request, Response } from 'express';
import { IdeaService } from '../services/IdeaService';
import { CreateIdeaRequest, VoteRequest } from '../types';

export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  async getAllIdeas(req: Request, res: Response): Promise<void> {
    const ipAddress = req.clientIp!;
    const result = await this.ideaService.getAllIdeas(ipAddress);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  }

  async getIdeaById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const ipAddress = req.clientIp!;
    const result = await this.ideaService.getIdeaById(id, ipAddress);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  }

  async createIdea(req: Request, res: Response): Promise<void> {
    const ideaData: CreateIdeaRequest = req.body;
    const result = await this.ideaService.createIdea(ideaData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  }

  async voteForIdea(req: Request, res: Response): Promise<void> {
    const voteData: VoteRequest = req.body;
    const ipAddress = req.clientIp!;
    const result = await this.ideaService.voteForIdea(voteData, ipAddress);
    
    if (result.success) {
      res.json(result);
    } else {
      // Возвращаем 409 Conflict для ошибок голосования
      res.status(409).json(result);
    }
  }

  async getUserVotesInfo(req: Request, res: Response): Promise<void> {
    const ipAddress = req.clientIp!;
    const result = await this.ideaService.getUserVotesInfo(ipAddress);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  }
}

