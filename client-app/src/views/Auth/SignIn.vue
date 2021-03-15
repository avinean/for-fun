<template>
  <div v-if="state.authorization" class="login_wrapper">
    <el-dialog
      v-model="state.authorization"
      title="Log into account"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="460px"
      @close="cancel"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="Email" prop="email">
          <el-input placeholder="example@email.com" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="pass">
          <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="submit"
            icon="el-icon-user-solid"
            :loading="loading"
            :disabled="loading"
          >Sign in</el-button>
          <el-button
            @click="registration"
            type="text"
          >
            I don't have account yet
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, reactive, Ref, ref,
} from 'vue';
import router from '@/router';
import { AuthRequest, State, Store } from '@doer/entities';
import AuthService from '../../services/AuthService';
import defaultStore from '../../store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: Store = inject<Store>('store', defaultStore);
    const state: State = inject<State>('state', defaultStore.state);
    const formRef: Ref<any> = ref(null);

    const loading: Ref<boolean> = ref(false);
    const form: AuthRequest = reactive({
      email: '',
      pass: '',
    });

    const rules = {
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
      ],
      pass: [
        { required: true, message: 'Please input password', trigger: 'blur' },
      ],
    };

    const signIn = () => {
      loading.value = true;
      authService.signIn(form)
        .then(() => {
          if (state.authorization) {
            state.authorization.resolve();
            store.confirmAuthorization();
          }
        })
        .catch(message.error)
        .finally(() => {
          loading.value = false;
        });
    };

    const cancel = () => {
      if (state.authorization) {
        store.confirmAuthorization();
      }
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          signIn();
        }
      });
    };

    const registration = () => {
      store.confirmAuthorization();
      router.push('/registration');
    };

    return {
      store,
      state,
      loading,
      formRef,
      form,
      rules,

      submit,
      cancel,
      registration,
    };
  },
});
</script>
