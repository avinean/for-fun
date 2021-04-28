import { State, Store } from '@/models/Store/StoreInterface';
import { reactive, readonly } from 'vue';
import messageStore from './messageStore';
import userStore from './userStore';
import gameStore from './gameStore';

const state = reactive<State>({
  globalLoader: 0,
});

const loading: Store['loading'] = (load) => {
  load ? state.globalLoader++ : state.globalLoader -= 1;
};

export default {
  state: readonly(state),
  messageStore,
  userStore,
  gameStore,

  loading,
} as Store;
