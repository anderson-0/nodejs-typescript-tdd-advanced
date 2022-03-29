import './config/module-alias';
import 'reflect-metadata';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { createConnection } from 'typeorm';

createConnection(env.postgresConnection).then(() => {
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}).catch((err) => console.log(err));
