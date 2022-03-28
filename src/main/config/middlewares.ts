import { json, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(cors());
  app.use(json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.type('application/json');
    next();
  });
}
