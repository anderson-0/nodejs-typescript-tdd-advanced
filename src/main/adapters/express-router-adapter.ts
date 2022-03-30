import { Request, RequestHandler, Response } from 'express';
import { Controller } from '@/application/controllers';

type Adapter = (controller: Controller) => RequestHandler;

// Function that receives a controller and returns a function that receives a request and returns a response
export const adaptExpressRoute: Adapter = controller => async (req: Request, res: Response) => {
  const { statusCode, data } = await controller.handle({ ...req.body });
  const jsonData = statusCode === 200 ? data : { error: data.message }

  res.status(statusCode).json(jsonData);
};
