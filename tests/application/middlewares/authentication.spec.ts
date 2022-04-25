import { ForbiddenError } from '@/application/errors';
import { AuthenticationMiddleware } from '@/application/middlewares/authentication';

describe('Authentication Middleware', () => {
  let sut: AuthenticationMiddleware;
  let authorization: string;
  let authorize: jest.Mock;
  let userId: string;

  beforeAll(() => {
    userId = 'any_user_id';
    authorization = 'any_token';
    authorize = jest.fn().mockResolvedValue(userId);
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize);
  });

  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    });
  });

  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    });
  });

  it('should call authorize with correct input', async () => {
    await sut.handle({ authorization });

    expect(authorize).toHaveBeenCalledWith({
      token: authorization
    });

    expect(authorize).toHaveBeenCalledTimes(1);
  });

  it('should return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'));

    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    });
  });

  it('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        userId
      }
    });
  });
});
