import { GameRequest, Message, User } from "@doer/entities";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import db from "../DataBase/DataBase";

export default class SocketsGameAPI {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.socket = socket;
    this.initSockets();
  }

  private initSockets(): void {
    this.socket.on('invite to game', (invitation: GameRequest) => {  
      this.socket.broadcast.emit('invite to game', invitation);
    });
  }
}