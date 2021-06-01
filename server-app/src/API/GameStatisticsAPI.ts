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
        json_build_object(
          'id', i.id,
          'nickname', i.nickname,
          'name', i.name,
          'lastName', i.last_name,
          'photo', i.photo
        ) as invitor,
        json_build_object(
          'id', a.id,
          'nickname', a.nickname,
          'name', a.name,
          'lastName', a.last_name,
          'photo', a.photo
        ) as acceptor,
        (gh.winner_id = 131) as is_winner,
        json_build_object(
          'id', g.id,
          'image', g.image,
          'name', g.name,
          'str_id', g.str_id
        ) as game,
        (winner_id = 131) as is_winner,
        gh.created_at
      FROM games_history as gh
      LEFT JOIN games as g ON g.id = gh.game_id
      LEFT JOIN users as i ON i.id = gh.invitor
      LEFT JOIN users as a ON a.id = gh.acceptor
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
