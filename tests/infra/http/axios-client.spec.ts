import axios from 'axios';
import { AxiosHttpClient } from '@/infra/http';

// All requests to axios will be mocked, not real requests
jest.mock('axios');

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
    fakedAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    });
  });

  describe('GET', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params });

      expect(fakedAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return data on success', async () => {
      const result = await sut.get({ url, params });

      expect(result).toEqual('any_data')
    });

    it('should rethrow if axios throws', async () => {
      fakedAxios.get.mockRejectedValueOnce(new Error('http_error'));

      const promise = sut.get({ url, params });

      await expect(promise).rejects.toThrow(new Error('http_error'));
    });
  });
});
