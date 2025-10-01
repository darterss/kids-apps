import { Router } from 'express';
import { IdeaController } from '../controllers/IdeaController';

export function createIdeaRoutes(ideaController: IdeaController): Router {
  const router = Router();

  // GET /api/ideas - получить все идеи
  router.get('/', (req, res) => ideaController.getAllIdeas(req, res));

  // GET /api/ideas/:id - получить идею по ID
  router.get('/:id', (req, res) => ideaController.getIdeaById(req, res));

  // POST /api/ideas - создать новую идею
  router.post('/', (req, res) => ideaController.createIdea(req, res));

  // POST /api/ideas/vote - проголосовать за идею
  router.post('/vote', (req, res) => ideaController.voteForIdea(req, res));

  // GET /api/ideas/user/votes - получить информацию о голосах пользователя
  router.get('/user/votes', (req, res) => ideaController.getUserVotesInfo(req, res));

  return router;
}

