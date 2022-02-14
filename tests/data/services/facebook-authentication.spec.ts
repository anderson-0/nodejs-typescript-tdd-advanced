import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ISaveFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories/user-account-repository';
import { FacebookAuthenticationService } from '@/data/service';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAccount } from '@/domain/models';

import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'jest-mock';
import { ITokenGenerator } from '@/data/contracts/crypto';

jest.mock('@/domain/models/facebook-account-model');

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let crypto: MockProxy<ITokenGenerator>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;

  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock<ILoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });

    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValueOnce({ id: 'any_account_id' })
    crypto = mock();

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    );
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError());
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_email@mail.com' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  })

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call TokenGenerator with with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });
});
