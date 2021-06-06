import userStore from '@/store/userStore';
import {
  AuthRequest,
  AuthResponse,
  Params,
  RegistrationRequest,
  routerHelper,
} from '@doer/entities';
import BaseService from './BaseService';

export default class AuthService extends BaseService {
  signIn(params: AuthRequest): Promise<void> {
    return this.publicPost<AuthResponse>(routerHelper.signIn().path(), { params })
      .then(({ token }: AuthResponse) => {
        localStorage.sessionToken = token;
        localStorage.sessionDate = new Date().toISOString();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
  }

  signUp(params: Partial<RegistrationRequest>): Promise<void> {
    return this.publicPost(routerHelper.signUp().path(), { params });
  }

  confirmEmail(hash: string): Promise<void> {
    return this.publicGet(routerHelper.confirmEmail().dynamicPath(hash).path());
  }

  resendConfirmationLink(params: any) {
    return this.publicPost(routerHelper.resendEmailConfirmation().path(), { params });
  }

  restorePassword(params: any) {
    return this.publicPost(routerHelper.restorePassword().path(), { params });
  }

  resetPassword(params: any) {
    return this.publicPost(routerHelper.resetPassword().path(), { params });
  }
}
