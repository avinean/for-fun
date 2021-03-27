<template>
  <div class="tiktactoe">
    <div v-if="inviter && acceptor" class="tiktactoe__head">
      <div class="tiktactoe__game">
        <el-avatar
          shape="square"
          :size="80"
          :src="game.image"
        ></el-avatar>
        <h2>{{ game.name }}</h2>
      </div>
      <div class="tiktactoe__user">
        <el-avatar
          :src="inviter.photo || defaultAvatar"
        ></el-avatar>
        <template v-if="inviter.name && inviter.lastName">
          {{ inviter.name }} {{ inviter.lastName }} ({{ inviter.nickname }})
        </template>
        <template v-else>
          {{ inviter.nickname }}
        </template>
      </div>
      <div class="tiktactoe__score">
        0:0
      </div>
      <div class="tiktactoe__user">
        <template v-if="acceptor.name && acceptor.lastName">
          {{ acceptor.name }} {{ acceptor.lastName }} ({{ acceptor.nickname }})
        </template>
        <template v-else>
          {{ acceptor.nickname }}
        </template>
        <el-avatar
          :src="acceptor.photo || defaultAvatar"
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
import {
  computed, defineComponent, inject, onMounted,
} from 'vue';
import defaultAvatar from '@/assets/default_user.png';
import { useRoute } from 'vue-router';
import { Game } from '@doer/entities';

export default defineComponent({
  setup() {
    const route = useRoute();
    const userStore = inject<UserStoreInterface>('user');
    const gameStore = inject<GameStoreInterface>('game');
    const inviter = computed(() => gameStore?.state.inviter);
    const acceptor = computed(() => gameStore?.state.acceptor);
    const game = computed(() => {
      if (gameStore?.state.game) return gameStore?.state.game;

      const { groups: { gameId } } = route.path.match(/\/games\/(?<gameId>.+)/) as any;
      return gameStore?.state.games.find((g: Game) => g.strId === gameId);
    });
    const field = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    return {
      field,
      defaultAvatar,
      inviter,
      acceptor,
      game,

      userStore,
      gameStore,
    };
  },
});
</script>

<style lang="scss">
.tiktactoe {
  &__ {
    &head {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
      gap: 24px 0;
      width: 100vw;
      max-width: 450px;
      padding: 12px 0;
    }
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
    &user, &score {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .el-avatar {
        min-width: 40px;
      }
    }
    &user {
      justify-content: space-between;
    }
    &game {
      grid-column: 1/5;
      display: flex;
      align-items: center;

      .el-avatar {
        margin-right: 32px;
      }
    }
  }
}
</style>
