import { computed, reactive, readonly } from 'vue';
import { GameStateInterface, GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { Game, GameRequest, User } from '@doer/entities';
import router from '@/router';
import socket from '@/services/SocketService';
import { PageRoutes } from '@/models/common';
import GameService from '@/services/GameService';
import store from './store';
import messageStore from './messageStore';
import userStore from './userStore';

socket.init();

const state: any = reactive<GameStateInterface>({
  games: [],
  gamesLoading: false,
  currentGame: computed(() => {
    const route = router.currentRoute.value;
    const match = route.path.match(/\/games\/(?<gameId>.+)/) as any;
    if (!match) return;
    const { groups: { gameId } } = match;
    return state.games.find((game: Game) => game.strId === gameId);
  }),

  inviter: null,
  acceptor: null,
  game: null,
  gameTemporaryID: Math.random(),
  isGameFinished: true,
  isWaitingForGame: false,

  acceptGame: () => {},
  cancelGame: () => {},
});

const clearState = () => {
  state.inviter = null;
  state.acceptor = null;
  state.game = null;
  state.gameTemporaryID = Math.random();
  state.isGameFinished = true;
  state.isWaitingForGame = false;
  state.acceptGame = () => {};
  state.cancelGame = () => {};
};

const loadGames = () => {
  store.loading(true);

  new GameService().getGames().then((games: Game[]) => {
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

const sendInvitation = (user: User) => {
  const route = router.currentRoute.value;
  const currentUser = userStore?.state.user;
  if (user.id === currentUser?.id) return;
  if (!route.meta.isGame) return;

  const { groups: { gameId } } = route.path.match(/\/games\/(?<gameId>.+)/) as any;
  const currentGame = state.games.find((game: Game) => game.strId === gameId);

  if (!currentGame) return;

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
  router.push(`${PageRoutes.Games}/${game.strId}`);
};

const acceptInvitation = (inviter: User, acceptor: User, game: Game) => {
  onGameAcception(inviter, acceptor, game);

  socket.emit('accept invitation to game', { inviter, acceptor, game });
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
      } else if ((target as Element).closest('[data-invite-accept]')) {
        notification.close();
        acceptInvitation(inviter, acceptor, game);
      }
    },
  });
};

export default {
  state: readonly(state),
  socket,

  setUsers,
  loadGames,
  sendInvitation,
  finishGame,
  startGame,
  clearState,
} as GameStoreInterface;

socket.on('accept invitation to game', ({ inviter, acceptor, game }) => {
  onGameAcception(inviter, acceptor, game);
});
