import { Message, User } from "@doer/entities";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import db from "../DataBase/DataBase";

export default class SocketsChatAPI {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.socket = socket;
    this.initSockets();
  }

  private initSockets(): void {
    this.socket.on('chat message', (msg) => {
      const {
        id,
      } = this.user;
  
      db.one(`
        INSERT INTO messages (user_id, message)
        VALUES ($1, $2)
        RETURNING id, user_id, created_at, updated_at, message
      `, [id, msg])
        .then((message: Partial<Message>) => {
          this.socket.broadcast.emit('chat message', {
            user: this.user,
            message,
          });
          this.socket.emit('chat message', {
            user: this.user,
            message,
          });
        });
    });
  }

  private get user(): User {
    return this.socket.user;
  }
}