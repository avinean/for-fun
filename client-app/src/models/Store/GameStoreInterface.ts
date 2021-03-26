import { Game, GameRequest, User } from '@doer/entities';

export interface GameStateInterface {
  games: Game[];
  gamesLoading: boolean;

  user1: User | null;
  user2: User | null;
  game: Game | null;
  isWaitingForGame: boolean;

  acceptGame: any;
  cancelGame: any;
}

export interface GameStoreInterface {
  state: GameStateInterface;

  setUsers: (request: GameRequest) => void;
  loadGames: ()=> void;
}
