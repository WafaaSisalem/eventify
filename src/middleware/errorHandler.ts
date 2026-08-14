import type { Request, Response, NextFunction } from 'express';

import { HttpError } from '../errors/HttpError.ts';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 1. If it's an HttpError we intentionally threw, use its status code
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  // 3. If it's any other unknown crash, return a 500 Internal Server Error
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
  });
}
