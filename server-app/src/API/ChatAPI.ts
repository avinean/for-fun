import { MessageObject, User } from '@doer/entities';
import BaseAPI from './BaseAPI';

export default class ChatAPI extends BaseAPI {
  onGet(req, res) {
    const users: User[] = [];
    this.db.query(`
      SELECT
        messages.id,
        messages.created_at,
        messages.message,
        user.id as iud
      FROM messages
      LEFT JOIN usersON messages.user_is = users.id
      LIMIT 50
    `)
    .then((result) => {
      console.log(result)
      // const messages: MessageObject[] = result.map((message) => ({
      //   message,
      //   user: User;
      // }));

    })
  }
}