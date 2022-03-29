import { AuthenticationError } from '@/domain/entities/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { ILoadFacebookUserApi } from '@/domain/contracts/apis';
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/domain/contracts/repositories';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { ITokenGenerator } from '../contracts/crypto';

export class FacebookAuthenticationUseCase implements IFacebookAuthentication {
  constructor (
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly crypto: ITokenGenerator
  ) {}

  async perform (params: IFacebookAuthentication.Params): Promise<IFacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser({ token: params.token });
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });

      const user = new FacebookAccount(facebookData, accountData);

      const { id } = await this.userAccountRepository.saveWithFacebook(user);
      const token = await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      });
      return new AccessToken(token);
    }

    return new AuthenticationError();
  }
}
