<template>
  <div class="header__wrap">
    <header class="header">
      <div class="header__nav">
        <router-link :to="routerHelper.home().path()" class="header__link">
          <div class="header__link-inner">
            <img :src="logo" class="header__logo" alt="Doer Logo">
            DOER
          </div>
        </router-link>
        <!--      <router-link :to="routerHelper.home().path()" class="header__link">-->
        <!--        Home-->
        <!--      </router-link>-->
        <!--      <router-link :to="routerHelper.games().path()" class="header__link">-->
        <!--        Games-->
        <!--      </router-link>-->
        <!--      <router-link :to="routerHelper.about().path()" class="header__link">-->
        <!--        About us-->
        <!--      </router-link>-->
      </div>
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
import { routerHelper } from '@doer/entities';
import { useRouter } from 'vue-router';
import logo from '@/assets/logo.png';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import userStore from '@/store/userStore';

export default defineComponent({
  setup() {
    const store: UserStoreInterface = inject<UserStoreInterface>('userStore', userStore);
    const router = useRouter();

    const goToAccount = (): void => {
      router.push(routerHelper.account().path());
    };

    const logOut = (): void => {
      store.logOut();
      router.push(routerHelper.home().path());
    };

    return {
      state: store.state,
      routerHelper,
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

      &-inner {
        display: flex;
        align-items: center;
      }
    }
    //&link:hover, &link.router-link-active {
    //  background: rgba(200, 200, 200, .5);
    //}
  }
}
</style>
