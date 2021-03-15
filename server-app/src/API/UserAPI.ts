import { Routes } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class UserAPI extends BaseAPI {
  initRoutes() {
    this.router.get(Routes.User, async (req, res) => {
      res.send(req.user);
    });
  }
}