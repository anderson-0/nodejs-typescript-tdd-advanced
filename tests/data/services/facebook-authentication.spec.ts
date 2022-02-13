import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ICreateFacebookAccountRepository, ILoadUserAccountRepository } from '@/data/contracts/repositories/user-account';
import { FacebookAuthenticationService } from '@/data/service/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<ILoadUserAccountRepository>;
  let createFacebookAccountRepo: MockProxy<ICreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';
  beforeEach(() => {
    loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValueOnce({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });

    loadUserAccountRepo = mock<ILoadUserAccountRepository>();
    createFacebookAccountRepo = mock<ICreateFacebookAccountRepository>();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    );
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError());
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email@mail.com' });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  })

  it('Should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token })

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  })
});
