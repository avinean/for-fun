import {
  AuthRequest,
  AuthResponse,
  RegistrationRequest,
  Routes,
} from '@doer/entities';
import BaseService from './BaseService';
import UserService from './UserService';

export default class AuthService extends BaseService {
  signIn(params: AuthRequest): Promise<void> {
    return this.publicPost<AuthResponse>(Routes.SignIn, { params })
      .then(({ token }: AuthResponse) => {
        localStorage.sessionToken = token;
        localStorage.sessionDate = new Date().toISOString();
        console.log('user');
        new UserService().getUser();
      });
  }

  signUp(params: RegistrationRequest): Promise<void> {
    return this.publicPost(Routes.SignUp, { params });
  }
}
