import { User } from "./user";

export interface Game {
  id?: number;
  strId: string;
  image: string;
  name: string;
  description: string;
  isUnderDevelopment: boolean;
}

export interface GameRequest {
  game: Game;
  inviter: User;
  acceptor: User;
}
