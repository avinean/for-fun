<template>
  <div
    v-if="user"
    class="user-component"
    :class="{
      reverse: reverse
    }"
    @click="$emit('click')"
  >
    <el-avatar
      :src="user.photo || user.image || defaultAvatar"
    ></el-avatar>
    <div v-if="!noName" class="user-component__name">
      <template v-if="user.name">
        {{ user.name }} {{ user.lastName || '' }}
      </template>
      <template v-else>
        {{ user.nickname }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Game, User } from '@doer/entities';
import defaultAvatar from '@/assets/default_user.png';

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User | Game>,
      required: true,
    },
    reverse: {
      type: Boolean,
    },
    noName: {
      type: Boolean,
    },
  },
  data() {
    return {
      defaultAvatar,
    };
  },
});
</script>

<style lang="scss">
.user-component {
  display: flex;
  align-items: center;

  .el-avatar {
    min-width: 40px;
    margin-right: 4px;
    margin-left: 4px;
  }

  &.reverse {
    flex-direction: row-reverse;
  }
}
</style>
