
import { ITokenValidator } from '@/domain/contracts/crypto';

type Setup = (crypto: ITokenValidator) => Authorize;
type Input = { token: string }
type Output = string
export type Authorize = (params: Input) => Promise<Output>;

export const setupAuthorize: Setup = crypto => async params => {
  const userId = await crypto.validateToken(params)
  return userId
}
