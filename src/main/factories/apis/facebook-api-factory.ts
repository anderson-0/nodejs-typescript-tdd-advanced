import { env } from '@/main/config/env';

import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(new AxiosHttpClient(), env.facebookApi.clientId, env.facebookApi.clientSecret);
}
