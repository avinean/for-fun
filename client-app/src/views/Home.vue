<template>
  <div class="home container">
    <div class="games">
      <div class="games__cube">
        <div
          v-for="(game, i) in [...gameStore.state.games, ...gameStore.state.games]" :key="game.name"
          :class="`games__side games__side--${++i}`"
          :style="`background-image: url(${game.image || defaultImage})`"
          @click="openGame()"
        >
          <div class="game__label">
            {{game.name}}
          </div>
          <span>
            <el-button>Play</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { routerHelper } from '@doer/entities';
import defaultImage from '@/assets/puzzle.png';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';

export default defineComponent({
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const router = useRouter();

    const openGame = (): void => {
      gameStore?.clearState();
      router.push(routerHelper.games().path());
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

$size: 300px;

.home  {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.games {
  width: $size;
  perspective: 800px;
}

.games__cube {
  position: relative;
  display: block;
  width: $size;
  height: $size;
  margin: 40px;
  cursor: pointer;
  transform-style: preserve-3d;
  animation: spin3d 18s linear infinite;
}

.games__side {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  transform-style: preserve-3d;
  background-size: contain;
  border: 1px solid #cecece;
  border-radius: 25px;
}

.game__label {
  background: #eee;
  position: absolute;
  top: 72px;
  left: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 198px;
  height: 36px;
  border-radius: 8px;
  font-size: 24px;
  transform: rotateZ(-45deg) translateZ(15px);
}

.games__side span {
  transform: translateZ(20px);
  font-size: 40px;
}
.games__side--1 {
  transform: translateZ(($size / 2));
}
.games__side--2 {
  transform: translateZ(-($size / 2)) rotateY(180deg);
}
.games__side--3 {
  transform: translateX(($size / 2)) rotateY(90deg);
}
.games__side--4 {
  transform: translateX(-($size / 2)) rotateY(-90deg);
}
.games__side--5 {
  transform: translateY(($size / 2)) rotateX(-90deg);
}
.games__side--6 {
  transform: translateY(-($size / 2)) rotateX(90deg);
}

@keyframes spin3d {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

</style>
