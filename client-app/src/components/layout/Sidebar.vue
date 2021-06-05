<template>
  <el-menu :collapse="isCollapse">
    <el-menu-item @click="goTo(routerHelper.account().path())">
      <i class="el-icon-setting"></i>
      <template #title>Settings</template>
    </el-menu-item>
    <el-menu-item @click="goTo(routerHelper.account().statistics().path())">
      <i class="el-icon-s-data"></i>
      <template #title>Statistics</template>
    </el-menu-item>
<!--    <el-menu-item disabled>-->
<!--      <i class="el-icon-user"></i>-->
<!--      <template #title>Players | Under development</template>-->
<!--    </el-menu-item>-->
    <div class="spacer"></div>
<!--    <el-menu-item-->
<!--      @click="isCollapse = !isCollapse"-->
<!--    >-->
<!--      <i-->
<!--        :class="!isCollapse ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"-->
<!--      ></i>-->
<!--      <template #title>Collapse</template>-->
<!--    </el-menu-item>-->
  </el-menu>
</template>

<script lang="ts">
import { routerHelper } from '@doer/entities';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const isCollapse = ref<boolean>(false);
    const router = useRouter();

    const goTo = (route: string) => {
      router.push(route);
    };

    return {
      isCollapse,
      routerHelper,
      goTo,
    };
  },
});
</script>

<style lang="scss">
.el-menu {
  display: flex;
  flex-direction: column;
}
</style>
