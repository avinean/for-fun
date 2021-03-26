import { User } from "@doer/entities";

declare module 'socket.io' {
  export interface Socket {
    user?: User;
  }
}