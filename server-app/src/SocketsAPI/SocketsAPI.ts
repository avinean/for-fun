import { Server } from "socket.io";
import http from 'http';
import secret from '../secret/auth';
import SocketsChatAPI from "./SocketsChatAPI";

export default class SocketsAPI {
  private io: Server;

  constructor(http: http.Server) {
    this.io = new Server(http, {
      cors: {
        origin: 'http://127.0.0.1:8080',
      },
    });
    this.initAPI();
  }

  private initAPI(): void {
    this.io
    // .use(async (socket, next) => {
    //   const token = socket.handshake.query.token as string;

    //   const user = await secret.confirm(token);
    //   console.log(user.nickname, '===================');
    //   next()
    // })
    .on('connection', async (socket) => {
      const token = socket.handshake.query.token as string;
      const user = await secret.confirm(token);
      console.log(`user ${user.nickname} connected`);

      new SocketsChatAPI(socket, user);
    }); 
  }
}