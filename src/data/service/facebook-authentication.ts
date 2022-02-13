import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ILoadUserAccountRepository } from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository
  ) {

  }

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUser.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookData.email });
    }

    return new AuthenticationError();
  }
}
