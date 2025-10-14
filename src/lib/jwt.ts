import jwt from 'jsonwebtoken';
import { User } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'talentix-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const jwtUtils = {
  // Create JWT token
  createToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  },

  // Create password reset token
  createPasswordResetToken(email: string): string {
    const payload = {
      email,
      type: 'password_reset'
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
  },

  // Verify password reset token
  verifyPasswordResetToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.type !== 'password_reset') {
        return null;
      }

      return { email: decoded.email };
    } catch (error) {
      console.error('Password reset token verification failed:', error);
      return null;
    }
  }
};

