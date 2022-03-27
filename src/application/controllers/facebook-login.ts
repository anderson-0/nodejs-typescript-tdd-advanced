import { HttpResponse, ok, unauthorized } from '@/application/helpers';

import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { IValidator, ValidationBuilder } from '@/application/validations';
import { Controller } from './controller';

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {
    super();
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });

    if (accessToken instanceof AccessToken) {
      return ok({
        accessToken: accessToken.value
      });
    } else {
      return unauthorized()
    }
  }

  override buildValidators (httpRequest: HttpRequest): IValidator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ];
  }
}
