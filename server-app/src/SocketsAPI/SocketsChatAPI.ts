import { User } from "@doer/entities";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class SocketsChatAPI {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  private user: User;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>, user: User) {
    this.socket = socket;
    this.user = user;
    this.initSockets();
  }

  private initSockets(): void {
    this.socket.on('chat message', (message) => {
      console.log(this.user.nickname, message);
    });
  }
}