import UserService from '@/services/UserService';
import { reactive, readonly } from 'vue';
import { User } from '@doer/entities';
import { UserStateInterface, UserStoreInterface } from '@/models/Store/UserStoreInterface';
import messageStore from './messageStore';
import store from './store';

const state = reactive<UserStateInterface>({
  user: null,
  authorization: null,
  waitingForUser: false,
});
const confirmAuthorization: UserStoreInterface['confirmAuthorization'] = () => {
  state.authorization?.resolve();
  state.authorization = null;
  state.waitingForUser = false;
};
const setUser = (xuser?: Partial<User>) => {
  if (xuser) {
    state.user = xuser;
    return;
  }

  store.loading(true);
  new UserService().getUser()
    .then((user: Partial<User>) => {
      state.user = user;
      confirmAuthorization();
    })
    .catch(messageStore.error)
    .finally(() => {
      store.loading(false);
    });
};
const clearUser: UserStoreInterface['clearUser'] = () => {
  state.user = null;
};
const checkAuthorization: UserStoreInterface['checkAuthorization'] = () => {
  const sessionDate: any = new Date(localStorage.sessionDate);
  const currentDate: any = new Date();
  const { sessionToken } = localStorage;

  const maxSessionDuration = 24;
  const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
  const authentificated = sessionToken && (sessionDuration < maxSessionDuration);

  return authentificated;
};
const requireAuthorization: UserStoreInterface['requireAuthorization'] = () => new Promise((resolve, reject) => {
  const authentificated = checkAuthorization();
  state.authorization = { resolve, reject };

  if (!authentificated) {
    state.waitingForUser = true;
    return;
  }

  if (!state.user) setUser();
  else confirmAuthorization();
});
const logOut: UserStoreInterface['logOut'] = () => {
  localStorage.sessionToken = '';
  localStorage.sessionDate = '';
  state.user = null;
};

export default {
  state: readonly(state),

  setUser,
  clearUser,

  checkAuthorization,
  requireAuthorization,
  confirmAuthorization,
  logOut,
} as UserStoreInterface;
