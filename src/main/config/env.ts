import dotenv from 'dotenv';

dotenv.config();

export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '282640477364862',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '75da1427ec7845cee130e2b48c18f022'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres@123',
    database: process.env.DB_DATABASE ?? 'postgres'
  }
}
