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

<script lang="ts">
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import {
  computed, defineComponent, inject, onMounted, reactive, ref, watch, watchEffect,
} from 'vue';
import defaultAvatar from '@/assets/default_user.png';
import closeSign from '@/assets/close.svg';
import circleSign from '@/assets/circle.svg';
import { GameMessage, User } from '@doer/entities';
import defaultGameStore from '@/store/gameStore';
import defaultUserStore from '@/store/userStore';
import CUser from '@/components/User.vue';
import {
  checkWinner, Data,
  GameMessageData, getField, Signs,
} from './TikTacToeHelper';

export default defineComponent({
  components: { CUser },
  props: {
    cellsCount: {
      type: Number,
      default: 3,
    },
    winCombo: {
      type: Number,
      default: 3,
    },
  },
  setup() {
    const userStore = inject<UserStoreInterface>('user', defaultUserStore);
    const gameStore = inject<GameStoreInterface>('game', defaultGameStore);
    const game = computed(() => gameStore.state.currentGame);
    const isGameFinished = computed(() => gameStore.state.isGameFinished);
    const gameTemporaryID = computed(() => gameStore.state.gameTemporaryID);

    return {
      game,
      isGameFinished,
      gameTemporaryID,

      userStore,
      gameStore,
    };
  },
  data() {
    return {
      user: null,
      inviter: null,
      acceptor: null,
      isInviter: false,
      sign: Signs.Cross,
      Signs,
      closeSign,
      circleSign,
      defaultAvatar,
      turnOwner: -1,
      field: getField(this.cellsCount),
      turns: [],
      inviterScore: 0,
      acceptorScore: 0,
      winner: null,
      showWinner: false,
      reloadingPercentage: 0,
      reloadingTime: 3,
    } as Data;
  },
  watch: {
    inviter(newInviter) {
      this.turnOwner = newInviter.id;
    },
    gameTemporaryID() {
      /**
       * This watcher is used to detect new accepted game
       * It works each time when user accepts someone's request
      */
      console.log('restart', 'gameTemporaryID');
      this.startGame();
    },
    cellsCount() {
      console.log('restart', 'cellsCount');
      this.startGame();
    },
  },
  methods: {
    startGame() {
      const { user } = this.userStore.state;
      const { inviter, acceptor } = this.gameStore.state;

      this.user = user as User;
      this.inviter = inviter as User;
      this.acceptor = acceptor as User;
      this.isInviter = inviter?.id === user?.id;
      this.sign = this.isInviter ? Signs.Cross : Signs.Zero;
      this.inviterScore = 0;
      this.acceptorScore = 0;

      this.restartGame();
    },
    /**
     * Returns boolean that represents whether
     * winning combination is detected
     * Updates field's cells to highlight winning cells
     *
     * @return {void}
    */
    checkGameStatus(): void {
      const winningCombo = checkWinner(this.field, this.winCombo);
      if (winningCombo.length) {
        winningCombo.forEach(([y, x]) => {
          this.field[y][x].winCell = true;
        });
        this.gameStore.finishGame();
        this.setWinner(this.isInviter ? this.inviter : this.acceptor);
      }
    },
    /**
     * Function just checks if there are free cells
     *
     * @return {void}
    */
    checkDrawGame() {
      if (this.turns.length === this.cellsCount ** 2) {
        this.gameStore.finishGame();
        this.setWinner();
      }
    },
    /**
     * Function just sends notification to another user
     * with actuals state of game
     *
     * @return {void}
    */
    notifyAnotherUser(): void {
      const message: GameMessage<GameMessageData> = {
        data: {
          field: this.field,
          isGameFinished: !!this.isGameFinished,
          winner: this.winner as User,
          turns: this.turns,
        },
        to: (this.isInviter ? this.acceptor : this.inviter) as User,
      };
      this.gameStore.socket.emit('game message', message);
    },
    /**
     * Function toggles turn from user to user
     *
     * @return {void}
    */
    toggleTurn(): void {
      // updated current turn to make field inactive
      this.turnOwner = (this.turnOwner === this.inviter?.id
        ? this.acceptor?.id
        : this.inviter?.id) ?? -1;
    },
    /**
     * If it is current user's turn
     * amnd clicked cell is not filled
     * then user's sign sets to current cell
     * Game status checks to detect winning situation
     * Turn switches to another user
     * Another user notifies
     *
     * @param {number} y coordinate of cell
     * @param {number} x coordinate of cell
     * @return {void}
    */
    setSign(i: number, j: number): void {
      if (this.turnOwner !== this.user?.id) return;
      if (this.field[i][j].sign !== Signs.Empty) return;

      // fill cell with necessary symbols
      this.field[i][j].sign = this.sign;

      this.turns.push({
        x: j,
        y: i,
        sign: this.sign,
        ownerId: this.user?.id,
      });

      this.checkGameStatus();
      this.checkDrawGame();
      this.toggleTurn();
      this.notifyAnotherUser();
    },
    /**
     * Function updates score, shows message and refreshes game
     *
     * @returns {void}
    */
    setWinner(winner?: User | null) {
      this.showWinner = true;
      if (winner) {
        this.winner = winner;
        const isInviter = this.inviter?.id === winner.id;
        isInviter ? this.inviterScore++ : this.acceptorScore++;
      }

      const reloadingTime = 3000;
      const startTime = new Date().getTime();
      const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - startTime;
        if (timeDiff > reloadingTime) {
          clearInterval(timer);
          this.restartGame();
          this.showWinner = false;
          return;
        }

        this.reloadingPercentage = (timeDiff / reloadingTime) * 100;
        this.reloadingTime = Math.round((reloadingTime - timeDiff) / 1000);
      }, 100);
    },
    /**
     * Function restarts game by
     * clearing field
     * clearing winner
     * and switching isGameFinished flag
     *
     * @return {void}
    */
    restartGame() {
      this.clearGame();
      this.gameStore.startGame();
    },
    clearGame() {
      this.winner = null;
      this.reloadingPercentage = 0;
      this.reloadingTime = 3;
      console.log(this.cellsCount);
      this.field = getField(this.cellsCount);
      console.log(this.field);
      this.turns = [];
    },
  },
  mounted() {
    this.gameStore.socket.on('game message', (mesage: GameMessage<GameMessageData>) => {
      const {
        data: {
          field,
          isGameFinished,
          winner,
          turns,
        },
      } = mesage;
      Object.assign(this.field, field);
      this.turns.push(turns[turns.length - 1]);
      if (isGameFinished) {
        this.gameStore.finishGame();
        this.setWinner(winner);
      }
      this.toggleTurn();
    });
  },
});
</script>

<style lang="scss">
.tiktactoe {
  user-select: none;
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
      position: relative;
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: repeat(3, 1fr);
      width: 100vw;
      max-width: 450px;
      height: 100vw;
      max-height: 450px;
      cursor: pointer;

      &--3 {
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
      }

      &--19 {
        grid-template-rows: repeat(19, 1fr);
        grid-template-columns: repeat(19, 1fr);
      }

      &.inactive {
        cursor: not-allowed;
      }
      &.finished {
        opacity: .8;
        pointer-events: none;
      }
    }
    &win {
      &_message {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #0c0c0ca3;
        color: #fff;
      }
      &_content {
        margin: 10px 0;
        font-size: 30px;
        text-transform: uppercase;
      }
      &_reloader {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 12px;
      }
      &_time {
        font-size: 30px;
      }
    }
    &cell {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid grey;

      img {
        width: 90%;
        animation: appear .5s ;
        transform: scale(1);
        transition: all ease .2s;
      }

      &--win {
        background: #fff4e2;
      }

      &--win img {
        transform: scale(1.1);
      }

      @keyframes appear {
        0% {
          transform: scale(0.8);
        }
        80% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
    }
    &score  {
      text-align: center;
      font-size: 30px;
      span {
        padding: 0 10px;
      }
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
