import { User } from '@doer/entities';

export interface UserStateInterface {
  user: Partial<User> | null;
  authorization: {
    resolve: (value?: any) => void;
    reject: () => void;
  } | null;
  waitingForUser: boolean;
}

export interface UserStoreInterface {
  state: UserStateInterface;
  setUser: (user?: Partial<User>) => Promise<Partial<User>>,
  clearUser: () => void,
  checkAuthorization: () => boolean;
  requireAuthorization: () => Promise<void>;
  confirmAuthorization: () => void;
  rejectAuthorization: () => void;
  logOut: () => void;
}