<template>
  <div class="signup container container--mini">
    <template v-if="!loading && !restored">
      <h1 class="container__header">Restore password</h1>

      <div class="container__body">
        <el-form
          :model="form"
          :rules="rules"
          :inline="true"
          ref="formRef"
          label-position="left"
          label-width="200px"
        >
          <el-form-item prop="email">
            <el-input placeholder="example@email.com" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submit"
              icon="el-icon-key"
              :loading="waiting"
              :disabled="waiting"
            >Restore password</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template v-if="restored">
      <h1 class="container__header">Please check your email!</h1>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, onMounted, reactive, Ref, ref,
} from 'vue';
import { Store } from '@/models/Store/StoreInterface';
import AuthService from '@/services/AuthService';
import defaultStore from '@/store/store';

const authService = new AuthService();

export default defineComponent({
  setup() {
    const message: any = inject<any>('message');
    const store: Store = inject<Store>('store', defaultStore);
    const confirmed = ref<boolean>(false);
    const loading = computed(() => store.state.globalLoader);
    const waiting = ref(false);
    const restored = ref(false);
    const formRef: Ref<any> = ref(null);

    const form: Partial<{email: string}> = reactive({
      email: '',
    });

    const rules = {
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
      ],
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          waiting.value = true;
          authService.restorePassword(form)
            .then(() => {
              restored.value = true;
            })
            .catch(message.error)
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
      restored,
    };
  },
});
</script>

<style lang="scss">
.message {
  margin-bottom: 20px;
}
</style>
