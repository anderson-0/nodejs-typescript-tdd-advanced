import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { IHttpGetClient } from '../http';

export class FacebookApi implements ILoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: IHttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: ILoadFacebookUserApi.Params): Promise<ILoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token);

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getAppToken (): Promise<any> {
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    });
  }

  private async getDebugToken (clientToken: string): Promise<any> {
    const appToken = await this.getAppToken();
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    });
  }

  private async getUserInfo (clientToken: string): Promise<any> {
    const debugToken = await this.getDebugToken(clientToken);
    return this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    });
  }
}
