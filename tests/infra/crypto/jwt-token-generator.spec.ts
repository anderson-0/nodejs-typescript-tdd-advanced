import { ITokenGenerator } from '@/data/contracts/crypto';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken')

export class JwtTokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken (params: ITokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000;
    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds });
  }
}

describe('JWT Token Generator', () => {
  it('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>;
    const secret = 'any_secret';
    const sut = new JwtTokenGenerator(secret);
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 1 });
  });
});
