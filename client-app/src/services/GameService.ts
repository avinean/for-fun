import { Game, GameHistory, routerHelper } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class GameService extends BaseService {
  getGames(): Promise<Game[]> {
    return this.get<Game[]>(routerHelper.game().path());
  }

  setGameStatistic<T>(params: GameHistory<T>): Promise<void> {
    return this.post<void>(routerHelper.game().statistics().path(), { params });
  }

  getGameStatistic(): Promise<GameHistory<any>[]> {
    return this.get<GameHistory<any>[]>(routerHelper.game().statistics().path());
  }
}
