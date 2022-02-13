import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories/user-account';
import { FacebookAuthenticationService } from '@/data/service/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ICreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';
  beforeEach(() => {
    facebookApi = mock<ILoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValueOnce({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });

    userAccountRepository = mock<ILoadUserAccountRepository & ICreateFacebookAccountRepository>();
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

  it('Should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  })
});
