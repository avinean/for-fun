import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import UsersStore, { UserConfig } from "./UsersStore";

export default class SocketsUserAPI {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.socket = socket;
    this.initSockets();
  }

  private initSockets(): void {
    setInterval(() => {
      this.socket.emit('online users update', UsersStore.users.map(({ user }) => user));
    }, 3000);
  }
}