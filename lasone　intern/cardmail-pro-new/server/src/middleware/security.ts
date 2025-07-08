import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

// Input validation middleware
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      throw new AppError(400, 'Invalid input', error.errors);
    }
  };
};

// Sanitize file uploads
export const sanitizeFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError(400, 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  if (req.file.size > maxFileSize) {
    throw new AppError(400, 'File size exceeds 10MB limit.');
  }

  // Sanitize filename
  req.file.originalname = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

  next();
};

// Prevent NoSQL injection
export const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
  // Deep clean request objects
  const clean = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (/[$]/.test(key)) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          obj[key] = clean(obj[key]);
        }
      }
    }
    return obj;
  };

  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);

  next();
};

// API key validation for external services
export const validateApiKeys = (req: Request, res: Response, next: NextFunction) => {
  const requiredKeys = ['OPENAI_API_KEY', 'GCV_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    console.error('Missing required API keys:', missingKeys);
    throw new AppError(500, 'Server configuration error');
  }

  next();
};