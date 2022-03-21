import { ITokenGenerator } from '@/data/contracts/crypto';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken')

export class JwtTokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken (params: ITokenGenerator.Params): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds });
    return token;
  }
}

describe('JWT Token Generator', () => {
  let sut: JwtTokenGenerator;
  const secret = 'any_secret';
  let fakeJwt: jest.Mocked<typeof jwt>;
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
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
});
