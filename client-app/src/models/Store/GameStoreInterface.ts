import SocketService from '@/services/SocketService';
import { Game, GameRequest, User } from '@doer/entities';

export interface GameStateInterface {
  games: Game[];
  gamesLoading: boolean;

  inviter: User | null;
  acceptor: User | null;
  game: Game | null;
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
}
