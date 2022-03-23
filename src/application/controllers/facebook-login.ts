import { RequiredFieldError, ServerError } from '@/application/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { badRequest, HttpResponse } from '@/application/helpers';

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (['', null, undefined].includes(httpRequest.token)) {
        return badRequest(new RequiredFieldError('token'));
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token });

      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error: any) {
      return {
        statusCode: 500,
        data: new ServerError(error)
      }
    }
  }
}
