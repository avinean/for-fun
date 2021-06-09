<template>
  <footer class="footer">
    <div class="footer__logo">
      <router-link :to="routerHelper.home().path()">
        <img :src="logo" class="" alt="Doer Logo">
      </router-link>
      <div class="footer__year">
        Doer
        <template v-if="startedYear === currentYear">
          {{ currentYear }}
        </template>
        <template v-else>
          {{ startedYear }} - {{ currentYear }}
        </template>
      </div>
    </div>
<!--    <div class="footer__navigation">-->
<!--      <router-link :to="routerHelper.home().path()" class="footer__link">-->
<!--        Home-->
<!--      </router-link>-->
<!--      <router-link :to="routerHelper.about().path()" class="footer__link">-->
<!--        About us-->
<!--      </router-link>-->
<!--      <router-link :to="routerHelper.account().path()" class="footer__link">-->
<!--        Account-->
<!--      </router-link>-->
<!--    </div>-->
  </footer>
</template>

<script lang="ts">
import { routerHelper } from '@doer/entities';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/logo.png';

export default defineComponent({
  setup() {
    const router = useRouter();
    const startedYear = 2021;
    const currentYear = new Date().getFullYear();

    const goToAccount = (): void => {
      router.push(routerHelper.account().path());
    };

    return {
      routerHelper,
      logo,
      startedYear,
      currentYear,

      goToAccount,
    };
  },
});
</script>

<style lang="scss">
.footer {
  display: flex;
  align-items: center;
  height: 200px;
  background: #303133;
  color: #fff;
  padding: 20px;

  &__ {
    &logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 150px;
      padding: 0 20px;

      & img {
        width: 100%;
      }
    }
    &navigation {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 10px;
      height: 100%;
    }
    &link {
      width: 100%;
      padding: 4px 10px;
      text-decoration: none;
      color: #C0C4CC;
      &:hover {
        background: #606266;
      }
    }
  }
}
</style>
