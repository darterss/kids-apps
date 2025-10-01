import { Request } from 'express';
import requestIp from 'request-ip';

export function getClientIpAddress(req: Request): string {
  return requestIp.getClientIp(req) || '127.0.0.1';
}