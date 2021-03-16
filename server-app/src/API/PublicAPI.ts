
import { Routes } from '@doer/entities';
import db from '../DataBase/DataBase';
import secret from '../secret/auth';
import BaseAPI from './BaseAPI';

export default class PublicAPI extends BaseAPI {
  initRoutes() {    
    this.router.post(Routes.SignIn, async (req, res) => {
      secret.check(req.body)
      .then(token => {
        res.status(200).send({ token });
      })
      .catch(err => {
        res.status(err.status).send(err);
      });
    });

    this.router.post(Routes.SignUp, async (req, res) => {
      const hash = secret.hash(req.body);
      const { email, nickname } = req.body;
      
      db.none(`
        INSERT INTO users
        (email, nickname, hash)
        VALUES
        ($1, $2, $3)
      `, [ email, nickname, hash ])
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          res.status(400).send({
            error: 'Email is already in use',
          });
        });
    });
  }
}