import axios from 'axios';
import { IHttpGetClient } from '@/infra/http';

export class AxiosHttpClient {
  async get (params: IHttpGetClient.Params): Promise<any> {
    const result = await axios.get(params.url, { params: params.params });
    return result.data;
  }
}
