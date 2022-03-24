import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'jest-mock';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { FacebookLoginController } from '@/application/controllers';
import { ServerError, UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validations';

jest.mock('@/application/validations/require-string');

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

  it('should return 400 if token field validation fails', async () => {
    const error = new Error('validation_error');

    // Mock the implementation of the validator to return an error
    const requiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }));

    mocked(RequiredStringValidator).mockImplementationOnce(requiredStringValidatorSpy);

    // Call the method to be tested any value. Since we are overwriting the implementation
    // the value does not matter
    const response = await sut.handle({ token });

    expect(RequiredStringValidator).toHaveBeenLastCalledWith('any_token', 'token');

    expect(response).toEqual({
      statusCode: 400,
      data: error
    })
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

  it('should return 500 if facebook authentication throws', async () => {
    const error = new Error('any_error');
    facebookAuth.perform.mockRejectedValueOnce(new ServerError());
    const response = await sut.handle({ token });

    expect(response).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  });
});
