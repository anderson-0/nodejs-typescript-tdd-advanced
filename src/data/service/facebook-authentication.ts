import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });

      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? facebookData.name,
        email: facebookData.email,
        facebookId: facebookData.facebookId
      });
    }

    return new AuthenticationError();
  }
}
