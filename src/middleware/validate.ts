import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { HttpError } from '../errors/HttpError.ts';

// Middleware to validate the Request Body
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new HttpError(400, 'Validation failed', result.error.issues));
      return;
    }
    req.body = result.data;
    next();
  };
};

// Middleware to validate the Request Query
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new HttpError(400, 'Validation failed', result.error.issues));
      return;
    }
    res.locals.query = result.data;
    next();
  };
};
