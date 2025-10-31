import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';

export function validateDto<T extends object = any>(dtoClass: ClassConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    validate(dtoObject).then(errors => {
      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          return Object.values(error.constraints || {}).join(', ');
        });
        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages
        });
      }
      req.body = dtoObject;
      return next();
    });
  };
}

export function validateQuery<T extends object = any>(dtoClass: ClassConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.query);
    validate(dtoObject).then(errors => {
      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          return Object.values(error.constraints || {}).join(', ');
        });
        return res.status(400).json({
          error: 'Query validation failed',
          details: errorMessages
        });
      }
      req.query = dtoObject as any;
      return next();
    });
  };
}