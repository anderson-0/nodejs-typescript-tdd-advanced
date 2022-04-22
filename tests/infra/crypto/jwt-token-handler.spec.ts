import jwt from 'jsonwebtoken';
import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken')

describe('JWT Token Handler', () => {
  let sut: JwtTokenHandler;
  let secret: string;
  let fakeJwt: jest.Mocked<typeof jwt>;

  beforeAll(() => {
    secret = 'any_secret';
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  describe('validateToken', () => {
    let token: string;
    let key: string;

    beforeAll(() => {
      token = 'any_token';
      key = 'any_key';
      fakeJwt.verify.mockImplementation(() => ({ key }));
    });
    it('should call verify with correct params', async () => {
      await sut.validateToken({ token });

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
    });

    it('should return the key used to sign the token', async () => {
      const generatedKey = await sut.validateToken({ token });

      expect(generatedKey).toBe(key);
    });

    it('should rethrow if JwtTokenGenerator.verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => {
        throw new Error('http_error');
      });

      const promise = sut.validateToken({ token });

      await expect(promise).rejects.toThrow(new Error('http_error'));
    });

    it('should throw if JwtTokenGenerator.verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null);

      const promise = sut.validateToken({ token });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('generateToken', () => {
    let key: string;
    let token: string;
    let expirationInMs: number;

    beforeAll(() => {
      key = 'any_key';
      token = 'any_token';
      expirationInMs = 1000;
      fakeJwt.sign.mockImplementation(() => token);
    });

    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key,
        expirationInMs: 1000
      });

      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    });

    it('should return a jwt token on success', async () => {
      const generatedToken = await sut.generateToken({
        key,
        expirationInMs
      });

      expect(generatedToken).toBe(token);
    });

    it('should rethrow if JwtTokenGenerator.sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('http_error');
      });

      const promise = sut.generateToken({
        key,
        expirationInMs
      });

      await expect(promise).rejects.toThrow(new Error('http_error'));
    });
  });
});
