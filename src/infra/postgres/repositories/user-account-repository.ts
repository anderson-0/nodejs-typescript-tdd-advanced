import { getRepository } from 'typeorm';

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PostgresUserAccountRepository implements ISaveFacebookAccountRepository {
  async load ({ email }: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({
      where: {
        email
      }
    });

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
        email: pgUser.email
      };
    }
    return undefined;
  }

  async saveWithFacebook ({ id, email, name, facebookId }: ISaveFacebookAccountRepository.Params): Promise<ISaveFacebookAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    let resultId: string;

    if (id === undefined) {
      const pgUser = await pgUserRepo.save({
        email,
        name,
        facebookId
      });

      resultId = pgUser.id.toString();
    } else {
      // updates should never change the email even if it is different
      resultId = id;
      await pgUserRepo.update(id, {
        name,
        facebookId
      });
    }
    return { id: resultId };
  }
}
