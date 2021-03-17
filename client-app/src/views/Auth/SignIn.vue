<template>
  <div v-if="store.state.waitingForUser" class="login_wrapper">
    <el-dialog
      v-model="store.state.authorization"
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
import { useRouter } from 'vue-router';
import { AuthRequest } from '@doer/entities';
import AuthService from '@/services/AuthService';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import userStore from '@/store/userStore';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: UserStoreInterface = inject<UserStoreInterface>('user', userStore);
    const formRef: Ref<any> = ref(null);
    const router = useRouter();

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
          if (store.state.authorization) {
            store.state.authorization.resolve();
            store.confirmAuthorization();
          }
        })
        .catch(message.error)
        .finally(() => {
          loading.value = false;
        });
    };

    const cancel = () => {
      if (store.state.authorization) {
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
