import { Message } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class MessageAPI extends BaseAPI {
  onPost(req, res) {
    const {
      chatId = null,
      message,
    } = req.body as Message;
    const {
      id,
    } = req.user;

    this.db.one(`
      INSERT INTO messages (chat_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [chatId, id, message])
      .then((result) => {
        console.log(result)
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      })
  }
}