import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { IdeaRepository } from './repositories/IdeaRepository';
import { IdeaService } from './services/IdeaService';
import { IdeaController } from './controllers/IdeaController';
import { createIdeaRoutes } from './routes/ideaRoutes';
import { ipMiddleware } from './middleware/ipMiddleware';

export function createApp(): express.Application {
  const app = express();
  
  // Инициализация Prisma
  const prisma = new PrismaClient();
  
  // Инициализация слоев архитектуры
  const ideaRepository = new IdeaRepository(prisma);
  const ideaService = new IdeaService(ideaRepository);
  const ideaController = new IdeaController(ideaService);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP за 15 минут
    message: {
      success: false,
      error: 'Слишком много запросов с вашего IP, попробуйте позже'
    }
  });

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(limiter);
  app.use(ipMiddleware);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      success: true, 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });

  // API routes
  app.use('/api/ideas', createIdeaRoutes(ideaController));

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  });

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

  return app;
}

