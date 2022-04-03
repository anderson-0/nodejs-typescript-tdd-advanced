import jwt from 'jsonwebtoken';
import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken')

describe('JWT Token Handler', () => {
  let sut: JwtTokenHandler;
  const secret = 'any_secret';
  let fakeJwt: jest.Mocked<typeof jwt>;
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });
  it('should call sign with correct params', async () => {
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 1 });
  });

  it('should return a jwt token on success', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });

    expect(token).toBe('any_token');
  });

  it('should rethrow if JwtTokenGenerator.sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('http_error');
    });

    const promise = sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });

    await expect(promise).rejects.toThrow(new Error('http_error'));
  });
});
