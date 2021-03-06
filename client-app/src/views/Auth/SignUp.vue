<template>
  <div class="signup container container--mini">
    <h1 class="container__header">Create an account</h1>

    <div class="container__body">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-position="left"
        label-width="180px"
      >
        <el-form-item label="Email" prop="email">
          <el-input placeholder="example@email.com" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="pass">
          <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
        </el-form-item>

        <el-form-item label="Confirm password" prop="confirmPass">
          <el-input placeholder="abcd1234%!" v-model="form.confirmPass" show-password></el-input>
        </el-form-item>

      </el-form>
    </div>

    <span class="container__footer container__footer--right">
      <el-button
        type="primary"
        @click="submit"
        icon="el-icon-user-solid"
        :loading="loading"
        :disabled="loading"
      >Create</el-button>
      <el-button
        @click="cancel"
        type="text"
      >Cancel</el-button>
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, reactive, Ref, ref,
} from 'vue';
import { RegistrationRequest } from '@doer/entities';
import { useRouter } from 'vue-router';
import { State, Store } from '@/models/Store/StoreInterface';
import { MessageStoreInterface } from '@/models/Store/MessageStoreInterface';
import AuthService from '@/services/AuthService';
import defaultStore from '@/store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message: any = inject<any>('message');
    const store: Store = inject<Store>('store', defaultStore);
    const state: State = inject<State>('state', defaultStore.state);
    const formRef: Ref<any> = ref(null);
    const router = useRouter();

    const show: Ref<boolean> = ref(true);
    const loading: Ref<boolean> = ref(false);
    const form: Partial<RegistrationRequest> = reactive({
      email: '',
      nickname: '',
      pass: '',
      confirmPass: '',
    });

    const validateConfirmPass = (_: any, value: string, callback: (e?: Error) => void) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== form.pass) {
        callback(new Error('Two passwords don\'t match!'));
      } else {
        callback();
      }
    };

    const rules = {
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
      ],
      nickname: [
        { required: true, message: 'Please input nickname', trigger: 'blur' },
      ],
      pass: [
        { required: true, message: 'Please input password', trigger: 'blur' },
      ],
      confirmPass: [
        { required: true, validator: validateConfirmPass, trigger: 'blur' },
      ],
    };

    const signUp = () => {
      loading.value = true;
      authService.signUp(form)
        .then(() => {
          message.success({
            title: 'Account successfully created',
            dangerouslyUseHTMLString: true,
            duration: 10000,
            message: `Please check your mailbox <span style="color: #409EFF">${form.email}</span> to confirm your account.`,
            onClose: () => router.push('/'),
          });
        })
        .catch(message.error)
        .finally(() => {
          loading.value = false;
        });
    };

    const cancel = () => {
      router.push('/');
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          signUp();
        }
      });
    };

    return {
      store,
      state,
      show,
      loading,
      formRef,
      form,
      rules,

      submit,
      cancel,
    };
  },
});
</script>
