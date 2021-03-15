import { User } from "./user";

export interface State {
  user: Partial<User> | null;
  authorization: {
    resolve: () => void;
    reject: () => void;
  } | null;
}

export interface Store {
  state: State;
  setUser: (user: Partial<User>) => void,
  clearUser: () => void,
  checkAuthorization: () => boolean;
  requireAuthorization: () => Promise<void>,
  confirmAuthorization: () => void,
}