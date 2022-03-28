import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationService } from '@/main/factories/services/facebook-authentication-service-factory';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationService = makeFacebookAuthenticationService();
  return new FacebookLoginController(facebookAuthenticationService);
}
