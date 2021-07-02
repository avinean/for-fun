<template>
  <div class="app">
    <c-header />
    <div class="main_wrapper">
      <c-sidebar v-if="isAccount"/>
      <div
        v-loading="isLoading"
        class="main"
      >
        <router-view></router-view>
      </div>
    </div>
    <div class="pre-footer">
      <c-online-users v-if="isAuthorized"/>
      <c-chat v-if="isAuthorized" :key="chatKey"/>
    </div>
    <c-footer />
    <c-sign-in />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, provide, watch,
} from 'vue';
import store from '@/store/store';
import CSidebar from '@/components/layout/Sidebar.vue';
import CHeader from '@/components/layout/Header.vue';
import CFooter from '@/components/layout/Footer.vue';
import CSignIn from '@/views/Auth/SignIn.vue';
import CChat from '@/components/Chat.vue';
import COnlineUsers from '@/components/OnlineUsers.vue';
import { useRoute } from 'vue-router';
import socket from '@/services/SocketService';
import { User, routerHelper } from '@doer/entities';

export default defineComponent({
  name: 'App',
  components: {
    CHeader,
    CFooter,
    CSignIn,
    CSidebar,
    CChat,
    COnlineUsers,
  },
  setup() {
    provide('message', store.messageStore);
    provide('userStore', store.userStore);
    provide('gameStore', store.gameStore);
    provide('store', store);
    provide('state', store.state);

    const route = useRoute();

    const isAccount = computed(() => route.path.includes(routerHelper.account().path()));
    const isLoading = computed(() => !!store.state.globalLoader);
    const isAuthorized = computed(() => !!store.userStore.state.user);
    const chatKey = computed(() => JSON.stringify(store.userStore.state.user));

    onMounted(() => {
      store.userStore.setUser();
      store.gameStore.loadGames();
    });

    watch(isAuthorized, (is: boolean) => {
      if (is) {
        socket.init();
      }
    });

    return {
      isAccount,
      isLoading,
      isAuthorized,
      chatKey,
    };
  },
});

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  min-height: 100vh;
}

.main, .main_wrapper {
  flex: 1;
  display: flex;
}

.main {
  padding: 40px 80px;
}

.pre-footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  display: flex;
  justify-content: flex-end;
}

header.header {
  position: relative;
  z-index: 1;
  padding: 20px;
  box-shadow: 0 0 2px 0 grey;
}

/* global */
.spacer {
  flex: 1;
}

.container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;

  .header {
    margin-bottom: 40px;
  }

  &__header {
    margin-bottom: 40px;
  }

  &__body {
    max-width: 696px;
  }

  &__footer {
    display: flex;

    &--right {
      justify-content: flex-end;
    }
  }

  &--mini {
    max-width: 696px;
  }
}

.mr-10 {
  margin-right: 10px !important;
}
.ml-10 {
  margin-right: 10px !important;
}
</style>
