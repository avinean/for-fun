<template>
  <div class="header__wrap">
    <header class="header">
      <router-link :to="routes.Home">
        <img :src="logo" class="header__logo" alt="Doer Logo">
      </router-link>
      <router-link :to="routes.Home" class="header__link">
        Home
      </router-link>
      <router-link :to="routes.Games" class="header__link">
        Games
      </router-link>
      <router-link :to="routes.About" class="header__link">
        About us
      </router-link>
      <div class="spacer"></div>
      <template v-if="state.user">
        <el-button
          type="danger"
          icon="el-icon-switch-button"
          circle
          class="mr-10"
          @click="logOut"
        ></el-button>
        <el-avatar
          :src="state.user.photo"
          @click="goToAccount"
        ></el-avatar>
      </template>
      <el-button
        v-else
        type="primary"
        :icon="!state.waitingForUser ? 'el-icon-user-solid' : 'el-icon-loading'"
        circle
        @click="goToAccount"
      ></el-button>
    </header>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { PageRoutes } from '@doer/entities';
import { useRouter } from 'vue-router';
import logo from '@/assets/logo.png';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import userStore from '@/store/userStore';

export default defineComponent({
  setup() {
    const store: UserStoreInterface = inject<UserStoreInterface>('userStore', userStore);
    const router = useRouter();
    const routes = PageRoutes;

    const goToAccount = (): void => {
      router.push(routes.Account);
    };

    const logOut = (): void => {
      store.logOut();
      router.push(routes.Home);
    };

    return {
      state: store.state,
      routes,
      logo,

      goToAccount,
      logOut,
    };
  },
});
</script>

<style lang="scss">
.header__wrap header.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  height: 100px;
  align-items: center;
  background: #ffffffcc;
}
.header {
  &__ {
    &wrap {
      height: 100px;
      width: 100vw;
    }
    &logo {
      width: 50px;
      margin: 0 25px;
    }
    &link {
      padding: 15px 25px;
      color: #606266;
      text-decoration: none;
    }
    &link:hover, &link.router-link-active {
      background: rgba(200, 200, 200, .5);
    }
  }
}
</style>
