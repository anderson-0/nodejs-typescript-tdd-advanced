import { adaptExpressMiddleware } from '@/main/adapters';
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication-factory';

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
