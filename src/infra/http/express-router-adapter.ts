import { Request, Response } from 'express';
import { Controller } from '@/application/controllers';

export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const response = await this.controller.handle({ ...req.body });
    if (response.statusCode === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.statusCode).json({ error: response.data.message });
    }
  }
}
