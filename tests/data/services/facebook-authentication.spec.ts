import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ISaveFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories/user-account';
import { FacebookAuthenticationService } from '@/data/service/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

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

  it('Should create account with Facebook data if user does not exist', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  })

  it('Should not update account name if user exists and has a name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    });

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  })

  it('Should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    });

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  })
});
