import { AuthRequest, AuthResponse, User } from '@doer/entities';
import store from '../store/store';
import message from '../store/messageStore';
import BaseService from './BaseService';

export default class UserService extends BaseService {
  getUser(): void {
    this.get<Partial<User>>('/user')
      .then((user: Partial<User>) => {
        console.log(user);
        store.setUser(user);
      }).catch(message.error);
  }
}
