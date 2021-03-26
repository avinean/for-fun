<template>
  <div class="container tiktactoe">
    <div v-if="user1 && user2" class="tiktactoe__head">
      <div class="tiktactoe__user">
        <el-avatar
          :src="user1.photo || defaultAvatar"
        ></el-avatar>
        <template v-if="user1.name && user1.lastName">
          {{ user1.name }} {{ user1.lastName }} ({{ user1.nickname }})
        </template>
        <template v-else>
          {{ user1.nickname }}
        </template>
      </div>
      <div class="tiktactoe__user">
        <template v-if="user2.name && user2.lastName">
          {{ user2.name }} {{ user2.lastName }} ({{ user2.nickname }})
        </template>
        <template v-else>
          {{ user2.nickname }}
        </template>
        <el-avatar
          :src="user2.photo || defaultAvatar"
        ></el-avatar>
      </div>
    </div>
    <div class="tiktactoe__field">
        <template v-for="(row, i) in field" :key="i">
          <template v-for="(col, j) in row" :key="j">
            <div class="tiktactoe__cell">{{ col }}</div>
          </template>
        </template>
    </div>
  </div>
</template>

<script lang="ts">
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import { computed, defineComponent, inject } from 'vue';
import defaultAvatar from '@/assets/default_user.png';

export default defineComponent({
  setup() {
    const userStore = inject<UserStoreInterface>('user');
    const gameStore = inject<GameStoreInterface>('game');
    const user1 = computed(() => gameStore?.state.user1);
    const user2 = computed(() => gameStore?.state.user2);
    const field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    return {
      field,
      defaultAvatar,
      user1,
      user2,

      userStore,
      gameStore,
    };
  },
});
</script>

<style lang="scss">
.tiktactoe {
  &__ {
    &field {
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: repeat(3, 1fr);
      width: 100vw;
      max-width: 450px;
      height: 100vw;
      max-height: 450px;
    }
    &cell {
      border: 1px solid grey;
    }
    &head{
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
