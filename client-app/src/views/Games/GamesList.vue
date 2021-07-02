<template>
  <el-row :gutter="20" style="width: 100%">
    <el-col :span="6" v-for="game in gameStore.state.games" :key="game.name">
      <el-card
        class="card"
        :class="{'card--development': game.isUnderDevelopment}"
        @click="openGame(game)"
      >
        <img
          :src="game.image || defaultImage"
          :alt="game.name"
          class="card__image"
        >
        <div class="card__content">
          <span>{{ game.name }}</span>
          <el-button type="text" class="button">Play</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Game, routerHelper } from '@doer/entities';
import defaultImage from '@/assets/puzzle.png';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';

export default defineComponent({
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const router = useRouter();

    const openGame = (game: Game): void => {
      if (game.isUnderDevelopment) return;
      gameStore?.clearState();
      router.push(routerHelper.games().dynamicPath(game.strId).path());
    };

    return {
      gameStore,
      defaultImage,
      openGame,
    };
  },
});
</script>

<style lang="scss">
  .card {
    position: relative;
    margin-bottom: 20px;
    cursor: pointer;

    &--development {
      cursor: auto;
    }
    &--development:before {
      content: "Under development";
      position: absolute;
      z-index: 1;
      padding: 4px;
      border-radius: 4px;

      color: #fff;
      background: #409EFF;
    }

    &--development:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 4px;
      background: rgba(100, 100, 100, .5);
    }

    &__ {
      &image {
        width: 100%;
        display: block;
      }
      &content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px;
      }
    }
    .el-card__body {
      padding: 0;
    }
  }
</style>
