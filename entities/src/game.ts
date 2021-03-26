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
  user1: User;
  user2: User;
}
