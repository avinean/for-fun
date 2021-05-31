import { Game, GameHistory, routerHelper, User } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class GameStatisticsAPI extends BaseAPI {
  onPost(req, res) {
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
  }

  onGet(req, res) {
    this.db.query(
      'SELECT * FROM games_history ' +
      'WHERE invitor = ${id} OR acceptor = ${id}',
      req.user
    ).then((statistics) => {
      res.send(statistics);
    }).catch((e) => {
      console.log(e)
      res.sendStatus(400);
    });
  }
}
