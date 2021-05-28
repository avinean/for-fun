<template>
  <div class="tiktactoe">
    <div class="tiktactoe__head">
      <div v-if="game" class="tiktactoe__game">
        <el-avatar
          shape="square"
          :size="80"
          :src="game.image"
        ></el-avatar>
        <h2>{{ game.name }}</h2>
      </div>
      <template v-if="inviter && acceptor">
        <c-user :user="inviter"></c-user>
        <div class="tiktactoe__score">
          <span>{{ inviterScore }}</span>
          <span>:</span>
          <span>{{ acceptorScore }}</span>
        </div>
        <c-user :user="acceptor" :reverse="true"></c-user>
      </template>
    </div>
    <div
      class="tiktactoe__field"
      :class="[{
        inactive: turnOwner !== user?.id,
        finished: isGameFinished
      }, `tiktactoe__field--${cellsCount}`]"
    >
        <template v-for="(row, i) in field" :key="i">
          <template v-for="(cell, j) in row" :key="j">
            <div
              @click="setSign(i, j)"
              class="tiktactoe__cell"
              :class="{'tiktactoe__cell--win': cell.winCell}"
            >
              <img
                v-if="cell.sign === Signs.Cross"
                :src="closeSign"
              >
              <img
                v-if="cell.sign === Signs.Zero"
                :src="circleSign"
              >
            </div>
          </template>
        </template>
        <div
          v-if="showWinner"
          class="tiktactoe__win_message"
        >
          <template v-if="winner">
            <c-user :user="winner"/>
            <span class="tiktactoe__win_content">
              has won
            </span>
          </template>
          <template v-else>
            <span class="tiktactoe__win_content">
              The game is draw
            </span>
          </template>
          <el-progress type="circle" :percentage="reloadingPercentage" status="success">
            <template #default>
              <div class="tiktactoe__win_reloader">
                <span >game will restart in</span>
                <span class="tiktactoe__win_time">{{ reloadingTime }}</span>
                <span>seconds</span>
              </div>
            </template>
          </el-progress>
        </div>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
