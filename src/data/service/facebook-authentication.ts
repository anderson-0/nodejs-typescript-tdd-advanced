import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository, IUpdateFacebookAccountRepository } from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ICreateFacebookAccountRepository & IUpdateFacebookAccountRepository
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });
      if (accountData !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookData.name,
          facebookId: facebookData.facebookId
        });
      } else {
        await this.userAccountRepository.createFromFacebook(facebookData);
      }
    }

    return new AuthenticationError();
  }
}
