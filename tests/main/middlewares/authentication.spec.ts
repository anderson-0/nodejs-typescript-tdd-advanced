import { sign } from 'jsonwebtoken';
import request from 'supertest';

import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { auth } from '@/main/middlewares';

import { ForbiddenError } from '@/application/errors';

describe('Authentication Middleware (Main Layer)', () => {
  let userId: string;
  let fakeRoute: string;

  beforeAll(async () => {
    userId = 'any_user_id';
    fakeRoute = '/fake_route';
  });

  it('should return 403 if authorization header is not provided ', async () => {
    app.get(fakeRoute, auth, (req, res) => {
      res.json(req.locals);
    })

    const { status, body } = await request(app).get('/fake_route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });

  it('should return 200 if a valid authorization header was not provided', async () => {
    const authorization = sign({ key: userId }, env.jwtSecret);

    app.get(fakeRoute, auth, (req, res) => {
      res.json(req.locals);
    })

    const { status, body } = await request(app)
      .get(fakeRoute)
      .set({ authorization });

    expect(status).toBe(200);
    expect(body).toEqual({
      userId
    });
  });
});
