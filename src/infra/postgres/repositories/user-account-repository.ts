import { getRepository } from 'typeorm';

import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PostgresUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser);

  async load (params: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({
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

    return undefined;
  }

  async saveWithFacebook (params: ISaveFacebookAccountRepository.Params): Promise<void> {
    if (params.id === undefined) {
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
    } else {
      // updates should never change the email even if it is different
      await this.pgUserRepo.update(params.id, {
        name: params.name,
        facebookId: params.facebookId
      });
    }
  }
}
