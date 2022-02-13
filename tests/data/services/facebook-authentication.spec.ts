import { IFacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUser: ILoadFacebookUserApi) {

  }

  async perform (params: IFacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUser.loadUser({ token: params.token });
  }
}

interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUser.Params) => Promise<void>
}

namespace ILoadFacebookUser {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string;
  async loadUser (params: ILoadFacebookUser.Params): Promise<void> {
    this.token = params.token;
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token');
  })
});
