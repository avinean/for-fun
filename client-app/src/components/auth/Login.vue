<template>
  <div class="login_wrapper">
    <el-dialog
      v-model="show"
      title="Log into account"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form :model="form">

        <el-form-item>
          <el-input placeholder="example@email.com" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input placeholder="abcd1234%!" v-model="form.pass" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="signIn"
            icon="el-icon-user-solid"
          >Sign in</el-button>
          <el-button type="text">I don't have account yet</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { AuthRequest } from '@doer/entities';
import AuthService from '../../services/AuthService';

const authService = new AuthService();

export default class HelloWorld extends Vue {
  show = true;

  form: AuthRequest = {
    email: '',
    pass: '',
  };

  signIn() {
    authService.signIn(this.form);
  }
}
</script>
