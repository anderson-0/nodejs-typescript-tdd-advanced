import { env } from '@/main/config/env';

import { FacebookAuthenticationUseCase } from '@/domain/use-cases';

import { JwtTokenGenerator } from '@/infra/crypto';
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFacebookApi } from '../apis/facebook-api-factory';

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const postgresUserAccountRepository = new PostgresUserAccountRepository();
  const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret);
  const facebookApi = makeFacebookApi();

  return new FacebookAuthenticationUseCase(facebookApi, postgresUserAccountRepository, jwtTokenGenerator);
}
