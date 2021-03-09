<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class CSidebar extends Vue {
  isCollapse = true;

  // handleOpen(key, keyPath) {
  //   console.log(key, keyPath);
  // }

  // handleClose(key, keyPath) {
  //   console.log(key, keyPath);
  // }
}
</script>
