import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository,
    private readonly createFacebookAccountRepository: ICreateFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUser.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      const userAccount = await this.loadUserAccountRepository.load({ email: facebookData.email });
      if (userAccount === undefined) {
        await this.createFacebookAccountRepository.createFromFacebook(facebookData);
      }
    }

    return new AuthenticationError();
  }
}
