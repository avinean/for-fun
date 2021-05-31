import { routerHelper, User } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class UserService extends BaseService {
  getUser(): Promise<Partial<User>> {
    return this.get<Partial<User>>(routerHelper.user().path());
  }

  updateUser(params: Partial<User>): Promise<Partial<User>> {
    return this.put<Partial<User>>(routerHelper.user().path(), { params });
  }
}
