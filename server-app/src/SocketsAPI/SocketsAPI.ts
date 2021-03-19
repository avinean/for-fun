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
    .use(this.checkAuth.bind(this))
    .on('connection', this.onConnection.bind(this)); 
  }

  private async checkAuth(socket, next) {
    const token = socket.handshake.auth.token as string;

    try {
      const user = await secret.confirm(token);
      socket.user = user;
      next();
    } catch {
      next(new Error('Authorization is required'));
    }
  }

  private async onConnection(socket) {
    console.log(`user ${socket.user.nickname} connected`);

    new SocketsChatAPI(socket);
  }
}