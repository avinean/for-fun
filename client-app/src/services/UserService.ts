import { AuthRequest, AuthResponse, User } from '@doer/entities';
import store from '../store/store';
import BaseService from './BaseService';

export default class UserService extends BaseService {
  getUser(): Promise<void> {
    return this.get<Partial<User>>('/user')
      .then((user: Partial<User>) => {
        console.log(user);
        store.setUser(user);
      });
  }
}
