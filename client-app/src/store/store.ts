import { reactive, readonly } from 'vue';

const state = reactive({
  loading: 0
});

const setLoading = loading => loading ? state.loading++ : state.loading--;

export default {
  state: readonly(state),

  setLoading,
};