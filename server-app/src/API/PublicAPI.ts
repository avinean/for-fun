import { Routes } from '../Routes';
import auth from '../secret/auth';
import BaseAPI from './BaseAPI';

export default class PublicAPI extends BaseAPI {
  noAuthorize = true;

  initRoutes() {
    this.router.post(Routes.SignIn, async (req, res) => {
      auth.check(req.body)
      .then(token => {
        res.send({ token });
      })
      .catch(err => {
        res.sendStatus(err.status).send(err.message);
      });
    });

    this.router.get(Routes.SignUp, (req, res) => {
      res.send({
        loged: 123
      })
    });
  }
}