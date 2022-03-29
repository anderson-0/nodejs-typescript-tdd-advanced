import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

const postgresConnection: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres@123',
  database: process.env.DB_DATABASE ?? 'postgres',
  entities: [
    'dist/infra/postgres/entities/index.js'
  ]
}

export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '282640477364862',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '75da1427ec7845cee130e2b48c18f022'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  postgresConnection
}
