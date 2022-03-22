import { IBackup, newDb } from 'pg-mem'
import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { Column, Entity, getRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

export class PostgresUserAccountRepository {
  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({
      where: {
        email: params.email
      }
    });

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
        email: pgUser.email
      };
    }
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId!: string;
}

describe('Postgres User Account Repository', () => {
  let sut: PostgresUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let connection: any;
  let cleanDbBackup: IBackup;
  beforeAll(async () => {
    const db = newDb();
    connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    });
    await connection.synchronize();

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
    await connection.close();
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
