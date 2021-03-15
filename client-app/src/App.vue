<template>
  <div class="app">
    <c-header />
    <div class="main">
      <router-view></router-view>
    </div>
    <c-footer />
    <c-sign-in />
  </div>
</template>

<script>
import { defineComponent, provide } from 'vue';
import store from '@/store/store';
import messageStore from '@/store/messageStore';
import CHeader from '@/components/layout/Header.vue';
import CFooter from '@/components/layout/Footer.vue';
import CSignIn from '@/views/Auth/SignIn.vue';

export default defineComponent({
  name: 'App',
  components: {
    CHeader,
    CFooter,
    CSignIn,
  },
  setup() {
    provide('message', messageStore);
    provide('store', store);
    provide('state', store.state);
  },
});

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
}

.main {
  flex: 1;
  display: flex;
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
}
</style>
