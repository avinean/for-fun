<template>
  <div class="signup">
    <el-dialog
      v-model="show"
      title="Create an account"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="600px"
      @close="cancel"
    >
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

      <template #footer>
        <span class="dialog-footer">
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
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, reactive, Ref, ref,
} from 'vue';
import {
  RegistrationRequest, State, Store,
} from '@doer/entities';
import router from '@/router';
import AuthService from '../../services/AuthService';
import defaultStore from '../../store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: Store = inject<Store>('store', defaultStore);
    const state: State = inject<State>('state', defaultStore.state);
    const formRef: Ref<any> = ref(null);

    const show: Ref<boolean> = ref(true);
    const loading: Ref<boolean> = ref(false);
    const form: RegistrationRequest = reactive({
      email: '',
      nickname: '',
      pass: '',
      confirmPass: '',
    });

    const validateConfirmPass = (_: any, value: string, callback: (e?: Error) => void) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== form.pass) {
        callback(new Error('Two inputs don\'t match!'));
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
        .then(console.log)
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
