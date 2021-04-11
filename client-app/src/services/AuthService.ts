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
        window.location.reload();
      });
  }

  signUp(params: Partial<RegistrationRequest>): Promise<void> {
    return this.publicPost(Routes.SignUp, { params });
  }
}
