<template>
  statistics {{ statistics }}
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref,
} from 'vue';
import { GameHistory } from '@doer/entities';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';

export default defineComponent({
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const statistics = ref<GameHistory<any>[]>([]);

    onMounted(() => {
      gameStore?.getGameStatistics().then((results: GameHistory<any>[]) => {
        console.log(results);
        statistics.value = results;
      });
    });

    return {
      statistics,
    };
  },
});
</script>
