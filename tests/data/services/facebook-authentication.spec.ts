import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUser: ILoadFacebookUserApi) {

  }

  async perform (params: IFacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUser.loadUser({ token: params.token });
    return new AuthenticationError();
  }
}

interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUser.Params) => Promise<void>
}

namespace ILoadFacebookUser {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string;
  result = undefined;
  async loadUser (params: ILoadFacebookUser.Params): Promise<ILoadFacebookUser.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token');
  });

  it('Should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError());
  })
});
