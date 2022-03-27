import { mock, MockProxy } from 'jest-mock-extended';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validations';

jest.mock('@/application/validations/composite');

describe('Facebook Login Controller', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<IFacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock<IFacebookAuthentication>();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([new RequiredStringValidator('any_token', 'token')]);
  });

  it('should call FacebookLoginController with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if facebook authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const response = await sut.handle({ token });

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  });

  it('should return 200 if facebook authentication succeeds', async () => {
    const response = await sut.handle({ token });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  });
});
