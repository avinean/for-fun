import { Routes, User } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class UserService extends BaseService {
  getUser(): Promise<Partial<User>> {
    return this.get<Partial<User>>(Routes.User);
  }

  updateUser(params: Partial<User>): Promise<Partial<User>> {
    return this.put<Partial<User>>(Routes.User, { params });
  }
}
