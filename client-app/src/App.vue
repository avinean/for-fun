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
    <c-footer />
    <c-sign-in />
  </div>
</template>

<script>
import { computed, defineComponent, provide } from 'vue';
import store from '@/store/store';
import CSidebar from '@/components/layout/Sidebar.vue';
import CHeader from '@/components/layout/Header.vue';
import CFooter from '@/components/layout/Footer.vue';
import CSignIn from '@/views/Auth/SignIn.vue';
import { useRoute } from 'vue-router';
import { Routes } from '@doer/entities';

export default defineComponent({
  name: 'App',
  components: {
    CHeader,
    CFooter,
    CSignIn,
    CSidebar,
  },
  setup() {
    provide('message', store.messageStore);
    provide('user', store.userStore);
    provide('store', store);
    provide('state', store.state);

    const route = useRoute();

    const isAccount = computed(() => route.path.includes(Routes.Account));
    const isLoading = computed(() => !!store.state.globalLoader);

    return {
      isAccount,
      isLoading,
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

footer.footer {
  background: #303133;
  color: #fff;
  padding: 20px;
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
}

.mr-10 {
  margin-right: 10px !important;
}
.ml-10 {
  margin-right: 10px !important;
}
</style>
