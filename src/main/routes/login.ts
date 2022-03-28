import { Router, Request, Response, NextFunction } from 'express';

export default (router: Router): void => {
  router.post('/api/login/facebook', (req: Request, res: Response, next: NextFunction) => {
    res.send({
      data: 'any_data'
    })
  });
}
