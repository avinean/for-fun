<template>
  <div class="signup container container--mini">
    <template v-if="!loading">
      <h1 class="container__header" >Email confirmation</h1>

      <div class="container__body">
        <p class="message" v-if="confirmed">
          Email confirmed
          <el-button
            type="primary"
            @click="login"
          >login</el-button>
        </p>
        <p class="message" v-else>
          Link is invalid or has expired
        </p>

        <el-form
          v-if="!confirmed"
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
              icon="el-icon-message"
              :loading="waiting"
              :disabled="waiting"
            >Resend confirmation link</el-button>
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

    const form: Partial<{email: string}> = reactive({
      email: '',
    });

    const rules = {
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
      ],
    };

    const checkConfirmation = () => {
      store.loading(true);
      authService.confirmEmail(route.params.hash as string)
        .then(() => {
          confirmed.value = true;
        })
        .catch(() => {
          confirmed.value = false;
        })
        .finally(() => {
          store.loading(false);
        });
    };

    const login = () => {
      router.push(PageRoutes.Account);
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          waiting.value = true;
          authService.resendConfirmationLink(form)
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

    onMounted(() => {
      checkConfirmation();
    });

    return {
      confirmed,
      loading,
      form,
      rules,
      submit,
      login,
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
