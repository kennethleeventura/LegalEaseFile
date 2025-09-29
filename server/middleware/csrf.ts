import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

interface CSRFRequest extends Request {
  csrfToken?: string;
}

export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000;
    
    this.tokens.set(sessionId, { token, expires });
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    if (!stored || stored.expires < Date.now()) {
      this.tokens.delete(sessionId);
      return false;
    }
    return stored.token === token;
  }

  static middleware() {
    return (req: CSRFRequest, res: Response, next: NextFunction) => {
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
      }

      const sessionId = req.session?.id || req.ip;
      const token = req.headers['x-csrf-token'] as string || req.body._csrf;

      if (!token || !this.validateToken(sessionId, token)) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }

      next();
    };
  }
}