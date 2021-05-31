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

  initRoutes() {
    this.router.post(routerHelper.history().path(), (req, res) => {
      this.db.query(
        'INSERT INTO games_history (invitor, acceptor, game_id, winner_id, state)' +
        'VALUES (${invitor}, ${acceptor}, ${gameId}, ${winnerId}, ${state})',
        { ...req.body, state: JSON.stringify(req.body.state) }
      ).then((e) => {
        console.log(e);
        res.send(200);
      }).catch((e) => {
        console.log(e);
        res.send(400);
      });
    });

    this.router.get(routerHelper.history().path(), (req, res) => {
      this.db.query(
        'SELECT * FROM games_history (invitor, acceptor, game_id, winner_id, state)' +
        'VALUES (${invitor}, ${acceptor}, ${gameId}, ${winnerId}, ${state})',
        { ...req.body, state: JSON.stringify(req.body.state) }
      ).then((e) => {
        res.send(200);
      }).catch((e) => {
        res.send(400);
      });
    });
  }
}
