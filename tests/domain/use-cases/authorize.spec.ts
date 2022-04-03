import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('@/domain/entities/facebook-account-model');

interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<ITokenValidator.Result>
}

export namespace ITokenValidator {
  export type Params = { token: string };
  export type Result = string;
}

type Input = { token: string }
type Output = string
type Authorize = (params: Input) => Promise<Output>;
type Setup = (crypto: ITokenValidator) => Authorize;

const setupAuthorize: Setup = crypto => async params => {
  const userId = await crypto.validateToken(params)
  return userId
}

describe('Authorize Use Case', () => {
  let crypto: MockProxy<ITokenValidator>;
  let sut: Authorize;

  let token: string;

  beforeAll(() => {
    token = 'any_token';

    crypto = mock();
    crypto.validateToken.mockResolvedValue('any_user_id')
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  })

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return the correct accessToken', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_user_id');
  });
});
