import { env } from '@/main/config/env';
import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: env.database.host,
  port: Number(env.database.port),
  database: env.database.database,
  synchronize: true,
  username: env.database.username,
  password: env.database.password,
  entities: [
    'dist/infra/postgres/entities/index.js'
  ]
}
