import { newDb } from 'pg-mem'
import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

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
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      });

      // create schema
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({ email: 'existing_email' });

      const sut = new PostgresUserAccountRepository();
      const account = await sut.load({ email: 'existing_email' });

      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('email');
      expect(account?.id).toBe('1');
      expect(account?.email).toBe('existing_email');

      await connection.close();
    });

    it('should return undefined if email does not exist', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      });

      // create schema
      await connection.synchronize();
      // const pgUserRepo = getRepository(PgUser);
      // await pgUserRepo.save({ email: 'existing_email' });

      const sut = new PostgresUserAccountRepository();
      const account = await sut.load({ email: 'existing_email' });

      expect(account).toBeUndefined();
      await connection.close();
    });
  });
});
