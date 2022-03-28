import { getRepository } from 'typeorm';

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PostgresUserAccountRepository implements ISaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser);

  async load ({ email }: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({
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
    let resultId: string;
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email,
        name,
        facebookId
      });

      resultId = pgUser.id.toString();
    } else {
      // updates should never change the email even if it is different
      resultId = id;
      await this.pgUserRepo.update(id, {
        name,
        facebookId
      });
    }
    return { id: resultId };
  }
}
