import { Routes } from '../Routes';
import auth from '../secret/auth';
import BaseAPI from './BaseAPI';

export default class UserAPI extends BaseAPI {
  noAuthorize = true;

  initRoutes() {
    this.router.get(Routes.User, async (req, res) => {
            
      //   return db.one(`SELECT last_authorization FROM users WHERE token = $1`, token)
      //     .then(async ({ last_authorization }) => {
      //       const sessionDate: any = new Date(last_authorization);
      //       const currentDate: any = new Date();

      //       const maxSessionDuration = 24;
      //       const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
      //       const authentificated = sessionDuration < maxSessionDuration;

      //       if (authentificated) {
      //         return true;
      //       } else {
      //         throw({ status: 403, message: 'Authorization is required'});
      //       }
      //     })
      //     .catch(err => {
      //       throw({ status: 403, message: 'Authorization is required'});
      //     });

      res.send(req.user);
    });
  }
}