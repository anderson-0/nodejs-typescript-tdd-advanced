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
});
