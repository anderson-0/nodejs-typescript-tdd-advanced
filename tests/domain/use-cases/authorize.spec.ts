import { mock, MockProxy } from 'jest-mock-extended';
import { ITokenValidator } from '@/domain/contracts/crypto';
import { Authorize, setupAuthorize } from '@/domain/use-cases/authorize';

jest.mock('@/domain/entities/facebook-account-model');

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
