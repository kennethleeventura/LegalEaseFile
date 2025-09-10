import { User as DatabaseUser } from '@shared/schema';

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface User {
      claims: {
        sub: string;
        email?: string;
        name?: string;
      };
    }
  }
}

export interface AuthenticatedUser extends DatabaseUser {
  claims: {
    sub: string;
    email?: string;
    name?: string;
  };
}
