<template>
  <div class="app">
    <c-header />
    <div class="main-wrapper">
      <c-sidebar />
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
    <c-footer />
    <c-login />
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import CHeader from './components/layout/Header.vue';
import CSidebar from './components/layout/Sidebar.vue';
import CFooter from './components/layout/Footer.vue';
import CLogin from './components/auth/Login.vue';

@Options({
  name: 'App',
  components: {
    CHeader,
    CSidebar,
    CFooter,
    CLogin,
  },
})
export default class App extends Vue {}

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

.main-wrapper {
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
</style>
