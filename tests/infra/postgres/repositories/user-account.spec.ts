import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm';

import { PgUser } from '@/infra/postgres/entities';
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFakeDb } from '@/tests/infra/postgres/mocks/connection';

describe('Postgres User Account Repository', () => {
  let sut: PostgresUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let cleanDbBackup: IBackup;
  beforeAll(async () => {
    const db = await makeFakeDb();

    // Creates a snapshot of the empty database before each test
    cleanDbBackup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    //
    cleanDbBackup.restore();
    sut = new PostgresUserAccountRepository();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' });

      const account = await sut.load({ email: 'any_email' });

      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('email');
      expect(account?.id).toBe('1');
      expect(account?.email).toBe('any_email');
    });

    it('should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'any_email' });

      expect(account).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_facebook_id'
      });

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' });

      expect(pgUser?.id).toBe(1);

      // tests if saveWithFacebook returns the id
      expect(id).toBe('1');
    });

    it('should update account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_facebook_id'
      });

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_facebook_id'
      });

      const pgUser = await pgUserRepo.findOne({ id: 1 });

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_facebook_id'
      });

      // tests if saveWithFacebook returns the id
      expect(id).toBe('1');
    });
  });
});
