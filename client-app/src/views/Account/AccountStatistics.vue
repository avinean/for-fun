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
        <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Invitor"
    >
      <template #default="scope">
        <c-user :no-name="true" :user="{ photo: scope.row.invitorImage}"/>
      </template>
    </el-table-column>
    <el-table-column
      label="Acceptor"
    >
      <template #default="scope">
        <c-user :no-name="true" :user="{ photo: scope.row.acceptorImage}"/>
      </template>
    </el-table-column>
    <el-table-column
      label="Game"
    >
      <template #default="scope">
        <c-user :no-name="true" :user="{ photo: scope.row.image}"/>
      </template>
    </el-table-column>
    <el-table-column
      label="Winner"
    >
      <template #default="scope">
        <el-result
          icon="success"
          v-if="scope.row.isWinner"
        ></el-result>
        <el-result
          icon="error"
          v-else
        ></el-result>
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
