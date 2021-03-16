<template>
  <el-menu :collapse="isCollapse">
    <el-menu-item>
      <i class="el-icon-setting"></i>
      <template #title>Settings</template>
    </el-menu-item>
    <el-menu-item disabled>
      <i class="el-icon-s-data"></i>
      <template #title>Statistics | Under development</template>
    </el-menu-item>
    <el-menu-item disabled>
      <i class="el-icon-user"></i>
      <template #title>Players | Under development</template>
    </el-menu-item>
    <div class="spacer"></div>
    <el-menu-item
      @click="isCollapse = !isCollapse"
    >
      <i
        :class="!isCollapse ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
      ></i>
      <template #title>Collapse</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const isCollapse = ref<boolean>(true);

    return {
      isCollapse,
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
