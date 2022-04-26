import { IMiddleware } from '@/application/middlewares';
import { RequestHandler } from 'express';

type Adapter = (middleware: IMiddleware) => RequestHandler;

export const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers });
    if (statusCode === 200) {
      const dataEntries = Object.entries(data).filter(entry => entry[1]);

      req.locals = { ...req.locals, ...Object.fromEntries(dataEntries) };
      next();
    }
    return res.status(statusCode).json({ error: data.message });
  };
}
