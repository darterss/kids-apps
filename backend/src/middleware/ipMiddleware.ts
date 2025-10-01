import { Request, Response, NextFunction } from 'express';
import { getClientIpAddress } from '../utils/ipUtils';

// Расширяем интерфейс Request для добавления clientIp
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

export function ipMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.clientIp = getClientIpAddress(req);
  next();
}

