import { AuthenticationError } from '@/domain/entities/errors';
import { ILoadFacebookUserApi } from '@/domain/contracts/apis';
import { ILoadUserAccountRepository, ISaveFacebookAccountRepository } from '@/domain/contracts/repositories';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { ITokenGenerator } from '../contracts/crypto';

export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string}>

// Function that receives ILoadFacebookUserApi, ILoadUserAccountRepository & ISaveFacebookAccountRepository,
// and ITokenGenerator and returns a function that receives a params and returns a Promise<Result>
export const setupFacebookAuthentication = (
  loadFacebookUserApi: ILoadFacebookUserApi,
  loadUserAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
  crypto: ITokenGenerator
): FacebookAuthentication => async (params) => {
  const facebookData = await loadFacebookUserApi.loadUser({ token: params.token });
  if (facebookData !== undefined) {
    const accountData = await loadUserAccountRepository.load({ email: facebookData.email });

    const user = new FacebookAccount(facebookData, accountData);

    const { id } = await loadUserAccountRepository.saveWithFacebook(user);
    const accessToken = await crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs
    });
    return { accessToken }
  }

  throw new AuthenticationError();
}
