import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors';

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.issues.map(issue => issue.message).join(', ')));
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
        next(new ValidationError(error.issues.map(issue => issue.message).join(', ')));
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
        next(new ValidationError(error.issues.map(issue => issue.message).join(', ')));
      } else {
        next(error);
      }
    }
  };
}