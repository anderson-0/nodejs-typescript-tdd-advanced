import { HttpResponse, ok, unauthorized } from '@/application/helpers';

import { AccessToken } from '@/domain/entities';
import { IValidator, ValidationBuilder } from '@/application/validations';
import { Controller } from './controller';
import { FacebookAuthentication } from '@/domain/use-cases';

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication({ token: httpRequest.token });

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
