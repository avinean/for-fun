import { User } from "@doer/entities";
import { GameStoreInterface } from "./GameStoreInterface";
import { MessageStoreInterface } from "./MessageStoreInterface";
import { UserStoreInterface } from './UserStoreInterface';

export interface State {
  globalLoader: number;
}

export interface Store {
  state: State;
  messageStore: MessageStoreInterface;
  userStore: UserStoreInterface;
  gameStore: GameStoreInterface;
  
  loading: (_: boolean) => void;
}