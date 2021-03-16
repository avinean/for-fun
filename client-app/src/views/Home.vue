<template>
  <div class="home container">
    <h1 class="header">This is our home page</h1>
    <el-row :gutter="20">
      <el-col :span="8" v-for="game in gamesList" :key="game.name">
        <el-card
          class="card"
          :class="{'card--development': game.isUnderDevelopment}"
          @click="openGame(game)"
        >
          <img :src="game.image" class="card__image">
          <div class="card__content">
            <span>{{ game.name }}</span>
            <el-button type="text" class="button">Play</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Game, PageRoutes } from '../models/common';

export default defineComponent({
  setup() {
    const router = useRouter();
    const gamesList: Game[] = [
      {
        image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        name: 'TikTokToe 3x3',
        stringId: 'tiktoktoe3x3',
        isUnderDevelopment: false,
      },
      {
        image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        name: 'TikTokToe 9x9',
        stringId: 'tiktoktoe9x9',
        isUnderDevelopment: true,
      },
      {
        image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        name: 'Battleship',
        stringId: 'battleship',
        isUnderDevelopment: true,
      },
    ];

    const openGame = (game: Game): void => {
      if (game.isUnderDevelopment) return;
      router.push(`${PageRoutes.Games}/${game.stringId}`);
    };

    return {
      gamesList,
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
