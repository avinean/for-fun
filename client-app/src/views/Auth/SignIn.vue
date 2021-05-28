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
          <el-button class="login_forgot" @click="forgotPassword" type="text">
            forgot password?
          </el-button>
        </el-form-item>

      </el-form>
      <template #footer>
        <span>
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
import { AuthRequest, PageRoutes } from '@doer/entities';
import AuthService from '@/services/AuthService';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import userStore from '@/store/userStore';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: UserStoreInterface = inject<UserStoreInterface>('userStore', userStore);
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
            store.confirmAuthorization();
          }
        })
        .catch(message.error)
        .finally(() => {
          loading.value = false;
        });
    };

    const cancel = () => {
      store.rejectAuthorization();
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
      router.push(`${PageRoutes.Auth}${PageRoutes.Registration}`);
    };

    const forgotPassword = () => {
      store.confirmAuthorization();
      router.push(`${PageRoutes.Auth}${PageRoutes.RestorePassword}`);
    };

    return {
      store,
      loading,
      formRef,
      form,
      rules,

      forgotPassword,
      submit,
      cancel,
      registration,
    };
  },
});
</script>

<style lang="scss">
.login_forgot {
  position: absolute;
  right: 0;
  bottom: -50%;
}
</style>
