import { AuthRequest, AuthResponse } from '@doer/entities';
import BaseService from './BaseService';

export default class AuthService extends BaseService {
  signIn(params: AuthRequest): Promise<void> {
    return this.publicPost<AuthResponse>('/sign-in', { params })
      .then(({ token }: AuthResponse) => {
        localStorage.sessionToken = token;
        localStorage.sessionDate = new Date().toISOString();
      });
  }
}
