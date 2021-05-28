<template>
  statistics
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, reactive, Ref, ref, watchEffect,
} from 'vue';
import { RegistrationRequest } from '@doer/entities';
import UserService from '@/services/UserService';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import userStore from '@/store/userStore';

const userService = new UserService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: UserStoreInterface = inject<UserStoreInterface>('userStore', userStore);
    const formRef: Ref<any> = ref(null);

    const show: Ref<boolean> = ref(true);
    const loading: Ref<boolean> = ref(false);
    const form: Partial<RegistrationRequest> = reactive({
      id: 0,
      email: '',
      nickname: '',
      name: '',
      lastName: '',
      age: 0,
      photo: '',
      pass: '',
      confirmPass: '',
    });

    const validateConfirmPass = (_: any, value: string, callback: (e?: Error) => void) => {
      if (value !== form.pass) {
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
      confirmPass: [
        { validator: validateConfirmPass, trigger: 'blur' },
      ],
    };

    const refresh = () => {
      Object.assign(form, store.state.user);
    };

    const imageUpload = ({ raw }: { raw: File }) => {
      const reader = new FileReader();
      reader.readAsDataURL(raw);
      reader.onload = () => {
        form.photo = reader.result as string;
      };
    };

    const updateUser = () => {
      loading.value = true;
      userService.updateUser(form)
        .then((user) => {
          store.setUser(user);
        })
        .catch(message.error)
        .finally(() => {
          loading.value = false;
        });
    };

    const cancel = () => {
      refresh();
    };

    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          updateUser();
        }
      });
    };

    onMounted(() => {
      refresh();
    });

    watchEffect(refresh);

    return {
      store,
      state: store.state,
      show,
      loading,
      formRef,
      form,
      rules,

      imageUpload,
      submit,
      cancel,
    };
  },
});
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
