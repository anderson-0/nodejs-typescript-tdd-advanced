import { env } from '@/main/config/env';

import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases';

import { JwtTokenHandler } from '@/infra/crypto';
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFacebookApi } from '../apis/facebook-api-factory';

export const makeFacebookAuthenticationUseCase = (): FacebookAuthentication => {
  const postgresUserAccountRepository = new PostgresUserAccountRepository();
  const jwtTokenHandler = new JwtTokenHandler(env.jwtSecret);
  const facebookApi = makeFacebookApi();

  return setupFacebookAuthentication(facebookApi, postgresUserAccountRepository, jwtTokenHandler);
}
