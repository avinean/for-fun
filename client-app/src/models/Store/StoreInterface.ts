import { User } from "@doer/entities";
import { MessageStoreInterface } from "./MessageStoreInterface";
import { UserStoreInterface } from './UserStoreInterface';

export interface State {
  globalLoader: number;
}

export interface Store {
  state: State;
  messageStore: MessageStoreInterface;
  userStore: UserStoreInterface;
  
  loading: (_: boolean) => void;
}