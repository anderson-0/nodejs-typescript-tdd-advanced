import { RequiredFieldError } from '@/application/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers';
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (['', null, undefined].includes(httpRequest.token)) {
        return badRequest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });

      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        });
      } else {
        return unauthorized()
      }
    } catch (error: any) {
      return serverError()
    }
  }
}
