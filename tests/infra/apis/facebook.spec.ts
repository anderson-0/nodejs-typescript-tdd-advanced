import { FacebookApi } from '@/infra/apis';
import { IHttpGetClient } from '@/infra/http';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Facebook API', () => {
  let clientId: string;
  let clientSecret: string;
  let sut: FacebookApi;
  let httpClient: MockProxy<IHttpGetClient>;
  beforeAll(() => {
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
    httpClient = mock<IHttpGetClient>()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' }) // first time httpClient.get is called
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } }) // second time httpClient.get is called
      .mockResolvedValueOnce({ id: 'any_facebook_id', name: 'any_facebook_name', email: 'any_facebook_email' }) // third time httpClient.get is called
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  });

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  });

  it('should get user info', async () => {
    const facebookUser = await sut.loadUser({ token: 'any_client_token' });

    expect(facebookUser).toEqual({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email'
    });
  });
});
