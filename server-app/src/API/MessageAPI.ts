import { User } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class MessageAPI extends BaseAPI {
  onGet(req, res) {
    const users: User[] = [];
    this.db.query(`
      SELECT
        json_build_object(
          'id', messages.id,
          'chatId', messages.chat_id,
          'userId', messages.user_id,
          'message', messages.message,
          'createdAt', messages.created_at,
          'updatedAt', messages.updated_at
        ) as message,
        json_build_object(
          'id', users.id,
          'nickname', users.nickname,
          'name', users.name,
          'lastName', users.last_name,
          'photo', users.photo
        ) as user
      FROM messages
      LEFT JOIN users ON messages.user_id = users.id
      GROUP BY messages.id, users.id
      ORDER BY messages.created_at DESC
      LIMIT 50
    `)
    .then((result) => {
      res.send(result);
    })
  }
}