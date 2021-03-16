<template>
  <div class="signup">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="left"
      label-width="180px"
    >
      <el-form-item label="Email" prop="email">
        <el-input
          placeholder="example@email.com"
          v-model="form.email"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="Nickname" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>

      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="form.lastName"></el-input>
      </el-form-item>

      <el-form-item label="Age" prop="age">
        <el-input v-model="form.age"></el-input>
      </el-form-item>

      <el-form-item label="Photo" prop="photo">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="imageUpload"
        >
          <img v-if="form.photo" :src="form.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="Password" prop="pass">
        <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
      </el-form-item>

      <el-form-item label="Confirm password" prop="confirmPass">
        <el-input placeholder="abcd1234%!" v-model="form.confirmPass" show-password></el-input>
      </el-form-item>

    </el-form>

    <el-button
      type="primary"
      @click="submit"
      icon="el-icon-user-solid"
      :loading="loading"
      :disabled="loading"
    >Save</el-button>
    <el-button
      @click="cancel"
      type="text"
    >Cancel</el-button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, reactive, Ref, ref, watchEffect,
} from 'vue';
import { RegistrationRequest } from '@doer/entities';
import UserService from '../../services/UserService';
import { UserStoreInterface } from '../../models/Store/UserStoreInterface';
import userStore from '../../store/userStore';

const userService = new UserService();

export default defineComponent({
  setup() {
    const message = inject<any>('message');
    const store: UserStoreInterface = inject<UserStoreInterface>('user', userStore);
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
