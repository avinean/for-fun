import { GameRequest, Message, User } from "@doer/entities";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import db from "../DataBase/DataBase";
import UsersStore, { UserConfig } from "./UsersStore";

export default class SocketsGameAPI {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.socket = socket;
    this.initSockets();
  }

  private initSockets(): void {
    this.socket.on('invite to game', (invitation: GameRequest) => {
      const config: UserConfig = UsersStore.getByUserID(invitation.acceptor.id);
      if (config) {
        this.socket.to(config.socketId).emit('invite to game', invitation);
      }
    });

    this.socket.on('accept invitation to game', (invitation: GameRequest) => {
      const config: UserConfig = UsersStore.getByUserID(invitation.inviter.id);
      if (config) {
        this.socket.to(config.socketId).emit('accept invitation to game', invitation);
      }
    });
  }
}