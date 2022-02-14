import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ISaveFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories/user-account-repository';
import { FacebookAuthenticationService } from '@/data/service';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAccount } from '@/domain/models';

import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

jest.mock('@/domain/models/facebook-account-model', () => {
  return {
    FacebookAccount: jest.fn().mockImplementation(() => {
      return {

      }
    })
  }
});

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';
  beforeEach(() => {
    facebookApi = mock<ILoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValueOnce({
      name: 'any_fb_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });

    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' });

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository
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
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call TokenGenerator with with correct params', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
