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
      `
      SELECT
        invitor,
        u1.photo AS invitor_image,
        acceptor,
        u2.photo AS acceptor_image,
        game_id,
        g.image,
        winner_id,
        (winner_id = 131) as is_winner,
        gh.created_at
      FROM games_history as gh
      LEFT JOIN games as g ON g.id = gh.game_id
      LEFT JOIN users as u1 ON u1.id = gh.invitor
      LEFT JOIN users as u2 ON u2.id = gh.acceptor
      WHERE invitor = $1 OR acceptor = $1`,
      [ req.user.id ]
    ).then((statistics) => {
      res.send(statistics);
    }).catch((e) => {
      console.log(e)
      res.sendStatus(400);
    });
  }
}
