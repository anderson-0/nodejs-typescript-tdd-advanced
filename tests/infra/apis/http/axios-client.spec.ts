import axios from 'axios';
import { IHttpGetClient } from '@/infra/http';

// All requests to axios will be mocked, not real requests
jest.mock('axios');

class AxiosHttpClient {
  async get (params: IHttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params });
  }
}

describe('Axios HTTP Client', () => {
  let sut: AxiosHttpClient;
  let fakedAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;
  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  beforeAll(() => {
    url = 'any_url';
    params = { any: 'any' };
    // Mock the axios.get method
    fakedAxios = axios as jest.Mocked<typeof axios>;
  });

  describe('GET', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params });

      expect(fakedAxios.get).toHaveBeenCalledWith(url, { params });

      expect(fakedAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
