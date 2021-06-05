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

export interface GameMessage<T> {
  data: T;
  to: User;
}

export interface GameHistory<T> {
  id?: number;
  invitor: number;
  acceptor: number;
  gameId: number;
  winnerId: number | null;
  createdAt?: string;
  state: T;
}

export interface GameStatistics {
  invitor: User;
  acceptor: User;
  game: Game;
  isWinner: boolean | null;
  createdAt: string;
}

export interface GameStatisticsParams {
  gameId: number;
  invitorId: number;
  acceptorId: number;
  isWinner: boolean | null;
}
