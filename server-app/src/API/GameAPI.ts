import { Game, GameHistory, routerHelper, User } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class GameAPI extends BaseAPI {
  onGet(req, res) {
    const users: User[] = [];
    this.db.query(`SELECT * FROM games`)
    .then((result: Game[]) => {
      res.send(result);
    });
  }
}
