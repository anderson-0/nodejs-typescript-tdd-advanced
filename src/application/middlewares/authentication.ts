import { Authorize } from '@/domain/use-cases';
import { HttpResponse, forbidden, ok } from '@/application/helpers';
import { RequiredStringValidator } from '@/application/validations';

type HttpRequest = {
  authorization: string
};

type HttpResponseModel = Error | { userId: string };

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}
  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<HttpResponseModel>> {
    if (!this.validate({ authorization })) return forbidden();

    try {
      const userId = await this.authorize({ token: authorization });
      return ok({ userId });
    } catch (error) {
      return forbidden();
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate();
    return error === undefined;
  }
}