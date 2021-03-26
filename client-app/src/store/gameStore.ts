import { reactive, readonly } from 'vue';
import { GameStateInterface, GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { Game, GameRequest, User } from '@doer/entities';
import router from '@/router';
import { PageRoutes } from '@/models/common';
import GameService from '@/services/GameService';
import messageStore from './messageStore';
import store from './store';

const state = reactive<GameStateInterface>({
  games: [],
  gamesLoading: false,

  user1: null,
  user2: null,
  game: null,
  isWaitingForGame: false,

  acceptGame: () => {},
  cancelGame: () => {},
});

const clearState = () => {
  state.user1 = null;
  state.user2 = null;
  state.game = null;
  state.isWaitingForGame = false;
  state.acceptGame = () => {};
  state.cancelGame = () => {};
};

const setUsers = ({ user1, user2, game }: GameRequest) => {
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
    <img src="${user1.photo}" style="object-fit: cover;"/>
    </span>
    <span>
    <b>${user1.name && user1.lastName
    ? `${user1.name} ${user1.lastName} (${user1.nickname})`
    : user1.nickname}
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
        state.user1 = user1;
        state.user2 = user2;
        state.game = game;
        router.push(`${PageRoutes.Games}/${game.strId}`);
      }
    },
  });
};

const loadGames = () => {
  store.loading(true);

  new GameService().getGames().then((games: Game[]) => {
    state.games = games;
  }).finally(() => {
    store.loading(false);
  });
};

export default {
  state: readonly(state),

  setUsers,
  loadGames,
} as GameStoreInterface;
