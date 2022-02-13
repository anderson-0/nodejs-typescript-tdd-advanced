import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/service/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;
  beforeEach(() => {
    loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError());
  })
});
