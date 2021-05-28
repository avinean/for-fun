<template>
  <div class="signup container container--mini">
    <template v-if="!loading">
      <h1 class="container__header">Set new password</h1>

      <div class="container__body">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-position="left"
          label-width="180px"
        >

          <el-form-item label="Password" prop="pass">
            <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
          </el-form-item>

          <el-form-item label="Confirm password" prop="confirmPass">
            <el-input placeholder="abcd1234%!" v-model="form.confirmPass" show-password></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submit"
              icon="el-icon-key"
              :loading="waiting"
              :disabled="waiting"
            >Reset password</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, onMounted, reactive, Ref, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { State, Store } from '@/models/Store/StoreInterface';
import AuthService from '@/services/AuthService';
import defaultStore from '@/store/store';
import { PageRoutes } from '@doer/entities';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message: any = inject<any>('message');
    const store: Store = inject<Store>('store', defaultStore);
    const router = useRouter();
    const route = useRoute();
    const confirmed = ref<boolean>(false);
    const loading = computed(() => store.state.globalLoader);
    const waiting = ref(false);
    const formRef: Ref<any> = ref(null);
    const form = reactive({
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
      pass: [
        { required: true, message: 'Please input password', trigger: 'blur' },
      ],
      confirmPass: [
        { required: true, validator: validateConfirmPass, trigger: 'blur' },
      ],
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          waiting.value = true;
          authService.resetPassword({ ...form, ...route.params })
            .then(() => {
              router.push(`${PageRoutes.Account}`);
            })
            .catch((err) => {
              message.error({
                ...err,
                dangerouslyUseHTMLString: true,
              });
            })
            .finally(() => {
              waiting.value = false;
            });
        }
      });
    };

    return {
      confirmed,
      loading,
      form,
      rules,
      submit,
      formRef,
      waiting,
    };
  },
});
</script>

<style lang="scss">
.message {
  margin-bottom: 20px;
}
</style>
