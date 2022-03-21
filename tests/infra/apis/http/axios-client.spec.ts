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
  describe('GET', () => {
    it('should call get with correct params', async () => {
      const fakedAxios = axios as jest.Mocked<typeof axios>;
      const sut = new AxiosHttpClient();

      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      });

      expect(fakedAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      });

      expect(fakedAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
