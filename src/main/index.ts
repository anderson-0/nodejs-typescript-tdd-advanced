import './config/module-alias';
import 'reflect-metadata';
import express, { json, Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.type('application/json');
  next();
});

const router = Router();
router.post('/api/login/facebook', (req: Request, res: Response, next: NextFunction) => {
  res.send({
    data: 'any_data'
  })
});
app.use(router);
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
