import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '../contracts/apis';

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUser: ILoadFacebookUserApi) {

  }

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUser.loadUser({ token: params.token });
    return new AuthenticationError();
  }
}
