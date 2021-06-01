<template>
  <el-table
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
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref,
} from 'vue';
import { GameHistory } from '@doer/entities';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import CUser from '@/components/User.vue';

export default defineComponent({
  components: { CUser },
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const statistics = ref<GameHistory<any>[]>([]);

    const getDate = (d: string): string => {
      const date = new Date(d);
      return `
      ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + 1).toString().padStart(2, '0')}`;
    };

    onMounted(() => {
      gameStore?.getGameStatistics().then((results: GameHistory<any>[]) => {
        console.log(results);
        statistics.value = results;
      });
    });

    return {
      statistics,
      getDate,
    };
  },
});
</script>

<style lang="scss">
.el-icon-success, .el-icon-error {
  font-size: 20px;
}

.el-icon-success {
  color: #67C23A;
}
.el-icon-error {
  color: #F56C6C;
}
</style>
