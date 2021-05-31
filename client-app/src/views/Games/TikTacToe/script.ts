import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';
import {
  computed, defineComponent, inject,
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
  GameMessageData, getField, Signs, TikTacToeCell,
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
      this.startGame();
    },
    cellsCount() {
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
     * Function sends notification to another user
     * with actual state of game
     *
     * If game is finished function also send statistic to BE
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

      if (this.isGameFinished && this.acceptor && this.inviter) {
        console.log(this.winner?.id);
        this.gameStore.setGameStatistics<TikTacToeCell[][]>({
          acceptor: this.acceptor?.id,
          invitor: this.inviter?.id,
          gameId: Number(this.game?.id),
          winnerId: this.winner?.id ?? null,
          state: this.field,
        });
      }

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
     * and clicked cell is not filled
     * then user's sign sets to current cell
     * Game status checks to detect winning situation
     * Turn switches to another user
     * Another user notifies
     *
     * @param {number} i coordinate of cell
     * @param {number} j coordinate of cell
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
      if (!this.acceptor || !this.inviter) return;

      if (winner) {
        this.winner = winner;
        const isInviter = this.inviter.id === winner.id;
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
      this.field = getField(this.cellsCount);
      this.turns = [];
    },
  },
  mounted() {
    this.startGame();
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
  unmounted() {
    this.gameStore.clearState();
  },
});
