import SocketService from '@/services/SocketService';
import { Game, GameRequest, User } from '@doer/entities';
import { ComputedRef } from 'vue';

export interface GameStateInterface {
  games: Game[];
  gamesLoading: boolean;
  currentGame: ComputedRef<Game | undefined>;

  inviter: User | null;
  acceptor: User | null;
  game: Game | null;
  gameTemporaryID: number;
  isGameFinished: boolean;
  isWaitingForGame: boolean;

  acceptGame: any;
  cancelGame: any;
}

export interface GameStoreInterface {
  state: GameStateInterface;
  socket: SocketService;

  setUsers: (request: GameRequest) => void;
  loadGames: ()=> void;
  sendInvitation: (user: User) => void;
  finishGame: () => void;
  startGame: () => void;
  clearState: () => void;
}
