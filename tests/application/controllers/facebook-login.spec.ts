import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpResponse = {
  statusCode: number
  data: any
}

class FacebookLoginController {
  constructor (private readonly facebookAuthentication: IFacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (['', null, undefined].includes(httpRequest.token)) {
      return {
        statusCode: 400,
        data: new Error('Token is required')
      }
    }
    const result = await this.facebookAuthentication.perform({ token: httpRequest.token });

    return {
      statusCode: 401,
      data: result
    }
  }
}

describe('Facebook Login Controller', () => {
  let facebookAuth: MockProxy<IFacebookAuthentication>;
  let sut: FacebookLoginController;
  beforeAll(() => {
    facebookAuth = mock<IFacebookAuthentication>();
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should return 400 if token is empty', async () => {
    const response = await sut.handle({ token: '' });

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token is required')
    })
  });

  it('should return 400 if token is null', async () => {
    const response = await sut.handle({ token: null });

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token is required')
    })
  });

  it('should return 400 if token is undefined', async () => {
    const response = await sut.handle({ token: undefined });

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token is required')
    })
  });

  it('should call FacebookLoginController with correct params', async () => {
    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if facebook authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const response = await sut.handle({ token: 'any_token' });

    expect(response).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  });
});
