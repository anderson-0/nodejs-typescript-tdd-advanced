import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationError, ServerError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { FacebookLoginController } from '@/application/controllers';

describe('Facebook Login Controller', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<IFacebookAuthentication>;

  beforeAll(() => {
    facebookAuth = mock<IFacebookAuthentication>();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
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

  it('should return 200 if facebook authentication succeeds', async () => {
    const response = await sut.handle({ token: 'any_token' });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  });

  it('should return 500 if facebook authentication throws', async () => {
    const error = new Error('any_error');
    facebookAuth.perform.mockRejectedValueOnce(new ServerError());
    const response = await sut.handle({ token: 'any_token' });

    expect(response).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  });
});
