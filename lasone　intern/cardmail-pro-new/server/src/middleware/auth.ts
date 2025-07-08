import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
  apiKeys?: {
    openaiApiKey?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    clearbitApiKey?: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(401, 'Access token required');
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(500, 'JWT secret not configured');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: '24h'
    }) as any;
    
    // Validate token payload
    if (!decoded.id || !decoded.email) {
      throw new AppError(403, 'Invalid token payload');
    }
    
    req.user = decoded;
    
    // ヘッダーからAPIキーを取得
    req.apiKeys = {
      openaiApiKey: req.headers['x-openai-key'] as string,
      googleClientId: req.headers['x-google-client-id'] as string,
      googleClientSecret: req.headers['x-google-client-secret'] as string,
      clearbitApiKey: req.headers['x-clearbit-key'] as string,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(403, 'Invalid token');
    }
    throw new AppError(403, 'Token verification failed');
  }
};

// Optional: Add refresh token validation
export const validateRefreshToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    throw new AppError(400, 'Refresh token required');
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(500, 'JWT secret not configured');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    }) as any;
    
    if (!decoded.id || !decoded.email || decoded.type !== 'refresh') {
      throw new AppError(403, 'Invalid refresh token');
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'Refresh token expired');
    }
    throw new AppError(403, 'Invalid refresh token');
  }
};