import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationUseCase } from '@/main/factories/use-cases/facebook-authentication-use-case-factory';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationUseCase = makeFacebookAuthenticationUseCase();
  return new FacebookLoginController(facebookAuthenticationUseCase);
}
