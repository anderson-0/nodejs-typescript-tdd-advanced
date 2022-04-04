import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { ITokenGenerator, ITokenValidator } from '@/domain/contracts/crypto';

export class JwtTokenHandler implements ITokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken (params: ITokenGenerator.Params): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds });
    return token;
  }

  async validateToken ({ token }: ITokenValidator.Params): Promise<void> {
    const payload = verify(token, this.secret) as JwtPayload;
    return payload.key;
  }
}
