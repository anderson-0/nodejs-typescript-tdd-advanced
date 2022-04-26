import request from 'supertest';
import { app } from '@/main/config/app';
import { ForbiddenError } from '@/application/errors';
import { auth } from '@/main/middlewares';

describe('Authentication Middleware (Main Layer)', () => {
  it('should return 200 ', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals);
    })

    const { status, body } = await request(app).get('/fake_route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });
});
