import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('Facebook API Integration Tests', () => {
  it('should return Facebook user if token is valid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);

    // The test user's token is valid for 3 months
    const facebookUser = await sut.loadUser({ token: 'EAAEBD11Aon4BAInP6tc9PaISuZBpmV14X9FykeytmEQQfgE0PPsRXtk6nollcPLZAWJXfK7Ufu2F1UMbhuk1FMZAjPZCmr6FPoArK6ZADznBeEYsDpRecE71jQSex1jugv0luxYYAqkqcMzJYFYTzwpUyIV1CZBO1ZAHwcjKww7iRrPvskarpX8Sk0du4h8xzNdQyljKVOV1QZDZD' });

    expect(facebookUser).toEqual({
      facebookId: '101068395903445',
      email: 'test_oofjfiq_user@tfbnw.net',
      name: 'Test User'
    });
  });
});
