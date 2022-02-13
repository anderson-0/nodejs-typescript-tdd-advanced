import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ICreateFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      const userAccount = await this.userAccountRepository.load({ email: facebookData.email });
      if (userAccount === undefined) {
        await this.userAccountRepository.createFromFacebook(facebookData);
      }
    }

    return new AuthenticationError();
  }
}
