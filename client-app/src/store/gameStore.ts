import {
  computed, reactive, readonly, watch,
} from 'vue';
import { GameStateInterface, GameStoreInterface } from '@/models/Store/GameStoreInterface';
import {
  Game, GameRequest, User, routerHelper, GameHistory, GameStatisticsParams,
} from '@doer/entities';
import router from '@/router';
import socket from '@/services/SocketService';
import GameService from '@/services/GameService';
import { INotificationHandle } from 'element-plus/lib/el-notification/src/notification.type';
import store from './store';
import messageStore from './messageStore';
import userStore from './userStore';

socket.init();

const gameService = new GameService();

/**
 * Invitation logic
 *
 * There are two users: acceptor and inviter
 * inviter: sendInvitation
 * acceptor: listens to 'invite to game' and opens confirmation window
 *      acceptor: clicks 'cancel' -> confirmation window hides.
 *                send cancellation to inviter to stop pending
 *      acceptor: clicks 'accept' -> onGameAcceptation runs and inviter
 *                notifies with 'accept invitation to game'
 * inviter: listens to 'accept invitation to game' and runs onGameAcceptation
 *          @TODO send cancellations to other acceptors from pending list
 *
*/

interface InvitationWindow {
  notification: INotificationHandle;
  inviterID: number;
  gameId: string;
}

const invitationWindows: InvitationWindow[] = [];

const state: any = reactive<GameStateInterface>({
  games: [],
  gamesLoading: false,
  currentGame: setCurrentGame(),

  inviter: null,
  acceptor: null,
  game: null,
  gameTemporaryID: Math.random(),
  isGameFinished: true,
  isGameRunning: computed(() => Boolean(state.inviter && state.acceptor)),
  pendingUsers: [],

  acceptGame: () => {},
  cancelGame: () => {},
});

watch(() => router.currentRoute.value, setCurrentGame);
watch(() => state.games, setCurrentGame);

function setCurrentGame(): Game | undefined {
  const route = router.currentRoute.value;
  const match = route.path.match(/\/games\/(?<gameId>.+)/) as any;
  if (!match) return;
  const { groups: { gameId } } = match;
  state.currentGame = state.games.find((game: Game) => game.strId === gameId);
}

const clearState = () => {
  state.inviter = null;
  state.acceptor = null;
  state.game = null;
  state.gameTemporaryID = Math.random();
  state.isGameFinished = true;
  state.pendingUsers = [];
  state.acceptGame = () => {};
  state.cancelGame = () => {};
};

const loadGames = () => {
  store.loading(true);

  gameService.getGames().then((games: Game[]) => {
    state.games = games;
  }).finally(() => {
    store.loading(false);
  });
};

const finishGame = () => {
  state.isGameFinished = true;
};

const startGame = () => {
  state.isGameFinished = false;
};

const sendInvitation = (user: User, game: Game) => {
  const route = router.currentRoute.value;
  const currentUser = userStore?.state.user;
  if (user.id === currentUser?.id) return;

  let currentGame = game;
  if (!currentGame) {
    const { groups: { gameId } } = route.path.match(/\/games\/(?<gameId>.+)/) as any;
    currentGame = state.games.find((g: Game) => g.strId === gameId);

    if (!currentGame) return;
  }

  state.pendingUsers = [...state.pendingUsers, user.id];

  socket.emit('invite to game', {
    inviter: currentUser,
    acceptor: user,
    game: currentGame,
  });
};

const onGameAcception = (inviter: User, acceptor: User, game: Game) => {
  state.inviter = inviter;
  state.acceptor = acceptor;
  state.game = game;
  state.isGameFinished = false;
  state.gameTemporaryID = Math.random();
  router.push(routerHelper.games().dynamicPath(game.strId).path());
};

const closeInvitations = (inviter: User, acceptor: User, game: Game) => {
  socket.emit('close invitation to game', {
    ids: state.pendingUsers,
    invitation: { inviter, acceptor, game },
  });

  state.pendingUsers = [];
};

const acceptInvitation = (inviter: User, acceptor: User, game: Game) => {
  onGameAcception(inviter, acceptor, game);

  socket.emit('accept invitation to game', { inviter, acceptor, game });
};

const cancelInvitation = (inviter: User, acceptor: User, game: Game) => {
  socket.emit('cancel invitation to game', { inviter, acceptor, game });
};

const setUsers = ({ inviter, acceptor, game }: GameRequest) => {
  const notification = messageStore.message({
    title: 'Invitation',
    duration: 0,
    showClose: false,
    dangerouslyUseHTMLString: true,
    message: `
    <div>
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
    <span
    class="el-avatar el-avatar--large el-avatar--circle chatbox__avatar"
    style="min-width: 40px; margin-right: 12px;"
    >
    <img src="${inviter.photo}" style="object-fit: cover;"/>
    </span>
    <span>
    <b>${inviter.name && inviter.lastName
    ? `${inviter.name} ${inviter.lastName} (${inviter.nickname})`
    : inviter.nickname}
    </b>
    <span>invintes you to play </span>
    <b>${game.name}</b>
    </span>
    <span
    class="el-avatar el-avatar--large el-avatar--circle chatbox__avatar"
    style="min-width: 40px; margin-left: 12px;"
    >
    <img src="${game.image}" style="object-fit: cover;"/>
    </span>
    </div>
    <div style="display: flex; align-items: center; justify-content: flex-end">
    <button class="el-button el-button--primary el-button--mini" type="button" data-invite-accept>
    <i class="el-icon-check"></i><span>Accept</span>
    </button>
    <button class="el-button el-button--danger el-button--mini" type="button" data-invite-close>
    <i class="el-icon-close"></i><span>Cancel</span>
    </button>
    </div>
    </div>
    `,
    onClick: (...[{ target }]: Event[]) => {
      if ((target as Element).closest('[data-invite-close]')) {
        notification.close();
        cancelInvitation(inviter, acceptor, game);
      } else if ((target as Element).closest('[data-invite-accept]')) {
        notification.close();
        acceptInvitation(inviter, acceptor, game);
      }
    },
  });

  invitationWindows.push({
    notification,
    inviterID: inviter.id,
    gameId: game.strId,
  });
};

const setGameStatistics = <T>(history: GameHistory<T>) => gameService.setGameStatistic<T>(history);

const getGameStatistics = (params: GameStatisticsParams) => gameService.getGameStatistic(params);

export default {
  state: readonly(state),
  socket,

  setUsers,
  loadGames,
  sendInvitation,
  finishGame,
  startGame,
  clearState,
  setGameStatistics,
  getGameStatistics,
} as GameStoreInterface;

/**
 * socket listeners
*/

socket.on('accept invitation to game', ({ inviter, acceptor, game }) => {
  if (!state.pendingUsers.length) return;
  closeInvitations(inviter, acceptor, game);
  onGameAcception(inviter, acceptor, game);
});

socket.on('cancel invitation to game', ({ inviter, acceptor, game }) => {
  const index = state.pendingUsers.indexOf(acceptor.id);
  if (index < 0) return;
  state.pendingUsers.splice(index, 1);
});

socket.on('invite to game', async (request: GameRequest) => {
  setUsers(request);
});

socket.on('close invitation to game', ({ inviter, game }: GameRequest) => {
  const config = invitationWindows.forEach(({ inviterID, gameId, notification }) => {
    if (inviterID === inviter.id && gameId === game.strId) {
      notification.close();
    }
  });
});
