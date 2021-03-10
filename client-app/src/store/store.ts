import { State, Store, User } from '@doer/entities';
import { reactive, readonly } from 'vue';

const state = reactive<State>({
  user: null,
  authorization: null,
});

const setUser = (user: Partial<User>): void => {
  state.user = user;
};
const clearUser = (): void => {
  state.user = null;
};

const requireAuthorization = (): Promise<void> => new Promise((resolve, reject) => {
  const sessionDate: any = new Date(localStorage.sessionDate);
  const currentDate: any = new Date();
  const { sessionToken } = localStorage;

  const maxSessionDuration = 24;
  const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
  const authentificated = sessionToken && (sessionDuration < maxSessionDuration);

  if (authentificated) {
    resolve();
  } else {
    state.authorization = { resolve, reject };
  }
});
const confirmAuthorization = (): void => {
  state.authorization = null;
};

export default {
  state: readonly(state),

  setUser,
  clearUser,

  requireAuthorization,
  confirmAuthorization,
} as Store;
