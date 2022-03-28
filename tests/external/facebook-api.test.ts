import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('Facebook API Integration Tests', () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;
  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
  });

  it('should return Facebook user if token is valid', async () => {
    // The test user's token is valid for 3 months
    const facebookUser = await sut.loadUser({ token: 'EAAEBD11Aon4BAInP6tc9PaISuZBpmV14X9FykeytmEQQfgE0PPsRXtk6nollcPLZAWJXfK7Ufu2F1UMbhuk1FMZAjPZCmr6FPoArK6ZADznBeEYsDpRecE71jQSex1jugv0luxYYAqkqcMzJYFYTzwpUyIV1CZBO1ZAHwcjKww7iRrPvskarpX8Sk0du4h8xzNdQyljKVOV1QZDZD' });

    expect(facebookUser).toEqual({
      facebookId: '101068395903445',
      email: 'test_oofjfiq_user@tfbnw.net',
      name: 'Test User'
    });
  });

  it('should return undefined if token is invalid', async () => {
    const facebookUser = await sut.loadUser({ token: 'invalid_token' });

    expect(facebookUser).toBeUndefined();
  });
});
