import { User } from '@doer/entities';
import BaseAPI from './BaseAPI';
import secret from '../Services/AuthService';

export default class UserAPI extends BaseAPI {
  onGet(req, res) {
    res.send(req.user);
  }

  onPut(req, res) {
    const {
      id, nickname, name, lastName, age, photo, pass,
    } = req.body as Partial<User>;
    let hash;
    if (pass) {
      hash = secret.hash(req.body);
    } 
    this.db.none(`
      UPDATE users SET
        nickname = $1,
        name = $2,
        last_name = $3,
        age = $4,
        photo = $5,
        hash = COALESCE($6, hash)
      WHERE id = $7
    `, [ nickname, name, lastName, age, photo, hash, id ]
    ).then(() => {
      res.send(req.body);
    }).catch((err) => {
      res.send(err);
    });
  }
}