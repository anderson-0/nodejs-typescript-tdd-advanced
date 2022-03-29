import request from 'supertest';
import { getConnection } from 'typeorm';
import { IBackup } from 'pg-mem';
import { app } from '@/main/config/app';

import { PgUser } from '@/infra/postgres/entities';

import { makeFakeDb } from '@/tests/infra/postgres/mocks';
import { UnauthorizedError } from '@/application/errors';

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup;

    const loadUserSpy = jest.fn();

    // Because app is imported at the top it instantiates FacebookApi already so we must
    // explicitly mock it
    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }));

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser]);
      backup = db.backup();
    });

    afterAll(async () => {
      await getConnection().close();
    });

    beforeEach(async () => {
      backup.restore();
    });

    it('should return HTTP 200 with access_token', async () => {
      loadUserSpy.mockResolvedValueOnce({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebook_id'
      });

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'any_token'
        });

      expect(status).toBe(200);
      expect(body).toBeDefined();
    });

    it('should return HTTP 401 with Unauthorized Error', async () => {
      // Since we are not mocking the FacebookApi it is an empty jest.fn() function
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'any_token'
        })

      expect(status).toBe(401);
      expect(body.error).toBe(new UnauthorizedError().message);
    });
  });
})
