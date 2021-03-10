<template>
  <div v-if="state.authorization" class="login_wrapper">
    <el-dialog
      v-model="state.authorization"
      title="Log into account"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="40%"
      @close="cancel"
    >
      <el-form :model="form">

        <el-form-item>
          <el-input placeholder="example@email.com" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="signIn"
            icon="el-icon-user-solid"
          >Sign in</el-button>
          <el-button type="text">I don't have account yet</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import { AuthRequest, State, Store } from '@doer/entities';
import AuthService from '../../services/AuthService';
import defaultStore from '../../store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const store: Store = inject<Store>('store', defaultStore);
    const state: State = inject<State>('state', defaultStore.state);

    const form: AuthRequest = reactive({
      email: '',
      pass: '',
    });

    const cancel = () => {
      if (state.authorization) {
        store.confirmAuthorization();
      }
    };

    const signIn = () => {
      authService.signIn(form)
        .then(() => {
          if (state.authorization) {
            state.authorization.resolve();
            store.confirmAuthorization();
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    };

    return {
      store,
      state,
      form,

      signIn,
      cancel,
    };
  },
});
</script>
