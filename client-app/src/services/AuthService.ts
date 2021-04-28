import userStore from '@/store/userStore';
import {
  AuthRequest,
  AuthResponse,
  RegistrationRequest,
  Routes,
} from '@doer/entities';
import BaseService from './BaseService';

export default class AuthService extends BaseService {
  signIn(params: AuthRequest): Promise<void> {
    return this.publicPost<AuthResponse>(Routes.SignIn, { params })
      .then(({ token }: AuthResponse) => {
        localStorage.sessionToken = token;
        localStorage.sessionDate = new Date().toISOString();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
  }

  signUp(params: Partial<RegistrationRequest>): Promise<void> {
    return this.publicPost(Routes.SignUp, { params });
  }

  confirmEmail(hash: string): Promise<void> {
    return this.publicGet(`${'/confirm-email'}/${hash}`);
  }

  resendConfirmationLink(params: any) {
    return this.publicPost('/resend-email-confirmation', { params });
  }

  restorePassword(params: any) {
    return this.publicPost('/restore-password', { params });
  }

  resetPassword(params: any) {
    return this.publicPost('/reset-password', { params });
  }
}
