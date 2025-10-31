import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  constructor(
    public errors: z.ZodError['issues'],
    message = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.issues));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      (req as any).query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.issues));
      } else {
        next(error);
      }
    }
  };
}

export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      (req as any).params = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.issues));
      } else {
        next(error);
      }
    }
  };
}