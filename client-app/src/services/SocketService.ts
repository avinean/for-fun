import {
  io, ManagerOptions, Socket, SocketOptions,
} from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

export default class SocketService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor() {
    const token: string = localStorage.sessionToken;
    const URL = 'http://localhost:5000';
    const options: Partial<ManagerOptions & SocketOptions> = {
      auth: {
        token,
      },
      autoConnect: false,
    };
    this.socket = io(URL, options);
  }

  init(): void {
    this.socket.connect();
  }

  emit(key: string, val: any): void {
    this.socket.emit(key, val);
  }

  on(key: string, handler: (args: any) => void): void {
    this.socket.on(key, handler);
  }
}
