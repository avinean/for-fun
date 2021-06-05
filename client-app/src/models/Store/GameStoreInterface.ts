import SocketService from '@/services/SocketService';
import {
  Game,
  GameHistory,
  GameRequest,
  GameStatistics,
  GameStatisticsParams,
  User,
} from '@doer/entities';
import { ComputedRef } from 'vue';

export interface GameStateInterface {
  games: Game[];
  gamesLoading: boolean;
  currentGame?: Game;

  inviter: User | null;
  acceptor: User | null;
  game: Game | null;
  gameTemporaryID: number;
  isGameFinished: boolean;
  isGameRunning: ComputedRef<boolean>;
  pendingUsers: number[];

  acceptGame: any;
  cancelGame: any;
}

export interface GameStoreInterface {
  state: GameStateInterface;
  socket: typeof SocketService;

  setUsers: (request: GameRequest) => void;
  loadGames: () => void;
  sendInvitation: (user: User, game: Game) => void;
  finishGame: () => void;
  startGame: () => void;
  clearState: () => void;
  setGameStatistics: <T>(history: GameHistory<T>) => Promise<void>;
  getGameStatistics: (params: GameStatisticsParams) => Promise<GameStatistics[]>;
}
