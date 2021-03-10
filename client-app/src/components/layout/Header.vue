<template>
  <header class="header">
    <router-link to="/">Doer</router-link>
    <div class="spacer"></div>
    <router-link to="/account">
      <el-button
        type="primary"
        :icon="!state.authorization ? 'el-icon-user-solid' : 'el-icon-loading'"
        circle
      ></el-button>
    </router-link>
  </header>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import { AuthRequest, State, Store } from '@doer/entities';
import AuthService from '../../services/AuthService';
import defaultStore from '../../store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const state: State = inject<State>('state', defaultStore.state);

    return {
      state,
    };
  },
});
</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
}
</style>
