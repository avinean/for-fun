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

const checkAuthorization: UserStoreInterface['checkAuthorization'] = () => {
  const sessionDate: any = new Date(localStorage.sessionDate);
  const currentDate: any = new Date();
  const { sessionToken } = localStorage;

  const maxSessionDuration = 24;
  const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
  const authentificated = sessionToken && (sessionDuration < maxSessionDuration);

  return authentificated;
};
const logOut: UserStoreInterface['logOut'] = () => {
  localStorage.sessionToken = '';
  localStorage.sessionDate = '';
  state.user = null;
  window.location.reload();
};
const confirmAuthorization: UserStoreInterface['confirmAuthorization'] = () => {
  state.authorization?.resolve();
  state.authorization = null;
  state.waitingForUser = false;
};
const rejectAuthorization: UserStoreInterface['rejectAuthorization'] = () => {
  state.authorization?.reject();
  state.authorization = null;
  state.waitingForUser = false;
};
const setUser = (xuser?: Partial<User>) => {
  if (xuser) {
    state.user = xuser;
    return;
  }

  if (!checkAuthorization()) {
    return;
  }

  if (state.user) {
    return;
  }

  store.loading(true);
  new UserService().getUser()
    .then((user: Partial<User>) => {
      state.user = user;
      confirmAuthorization();
    })
    .catch((error) => {
      messageStore.error(error);
      logOut();
    })
    .finally(() => {
      store.loading(false);
    });
};
const clearUser: UserStoreInterface['clearUser'] = () => {
  state.user = null;
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

export default {
  state: readonly(state),

  setUser,
  clearUser,

  checkAuthorization,
  requireAuthorization,
  confirmAuthorization,
  rejectAuthorization,
  logOut,
} as UserStoreInterface;
