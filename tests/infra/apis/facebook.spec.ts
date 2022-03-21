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
    httpClient.get.mockResolvedValueOnce({
      access_token: 'any_app_token'
    })
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
      url: 'https://graph.facebook.com/oauth/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  });
});