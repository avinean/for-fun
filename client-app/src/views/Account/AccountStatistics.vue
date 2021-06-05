<template>
  <div class="statistics">
    <div class="statistics__filters">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="Game">
          <el-select v-model="form.gameId" placeholder="game">
            <el-option
              v-for="game in games"
              :key="game.id"
              :label="game.name"
              :value="game.id"
              :disabled="game.isUnderDevelopment"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="statistics"
      stripe
      style="width: 100%"
    >
      <el-table-column
        label="Date"
      >
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ getDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Invitor"
      >
        <template #default="scope">
          <c-user :user="scope.row.invitor"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Acceptor"
      >
        <template #default="scope">
          <c-user :user="scope.row.acceptor"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Game"
      >
        <template #default="scope">
          <c-user :user="scope.row.game"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Winner"
      >
        <template #default="scope">
          <i class="el-icon-success" v-if="scope.row.isWinner === true"></i>
          <i class="el-icon-error" v-else-if="scope.row.isWinner === false"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, onMounted, reactive, ref, watch,
} from 'vue';
import { GameStatistics, GameStatisticsParams } from '@doer/entities';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import CUser from '@/components/User.vue';

export default defineComponent({
  components: { CUser },
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const loading = ref(false);
    const statistics = ref<GameStatistics[]>([]);
    const games = computed(() => gameStore?.state.games.filter((game) => !game.isUnderDevelopment));
    const form: GameStatisticsParams = reactive({
      gameId: 0,
      invitorId: 0,
      acceptorId: 0,
      isWinner: null,
    });

    const getDate = (d: string): string => {
      const date = new Date(d);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + 1).toString().padStart(2, '0')}`;
    };

    const setDefaultGame = () => {
      if (games.value?.length) {
        form.gameId = games.value[0].id as number;
      }
    };

    const getStatistics = () => {
      loading.value = true;
      gameStore?.getGameStatistics(form).then((results: GameStatistics[]) => {
        statistics.value = results;
        loading.value = false;
      });
    };

    setDefaultGame();
    watch(games, setDefaultGame);
    watch(form, getStatistics);

    onMounted(() => {
      getStatistics();
    });

    return {
      loading,
      games,
      form,
      statistics,
      getDate,
    };
  },
});
</script>

<style lang="scss">
.statistics {
  width: 100%;

  .el-icon-success, .el-icon-error {
    font-size: 20px;
  }

  .el-icon-success {
    color: #67C23A;
  }
  .el-icon-error {
    color: #F56C6C;
  }
}
</style>
