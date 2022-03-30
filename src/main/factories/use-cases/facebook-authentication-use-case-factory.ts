import { env } from '@/main/config/env';

import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases';

import { JwtTokenGenerator } from '@/infra/crypto';
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFacebookApi } from '../apis/facebook-api-factory';

export const makeFacebookAuthenticationUseCase = (): FacebookAuthentication => {
  const postgresUserAccountRepository = new PostgresUserAccountRepository();
  const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret);
  const facebookApi = makeFacebookApi();

  return setupFacebookAuthentication(facebookApi, postgresUserAccountRepository, jwtTokenGenerator);
}
