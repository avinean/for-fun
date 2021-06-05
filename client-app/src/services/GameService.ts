import {
  Game,
  GameHistory,
  GameStatistics,
  GameStatisticsParams,
  routerHelper,
} from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class GameService extends BaseService {
  getGames(): Promise<Game[]> {
    return this.get<Game[]>(routerHelper.game().path());
  }

  setGameStatistic<T>(params: GameHistory<T>): Promise<void> {
    return this.post<void>(routerHelper.game().statistics().path(), { params });
  }

  getGameStatistic(query: GameStatisticsParams): Promise<GameStatistics[]> {
    return this.get<GameStatistics[]>(routerHelper.game().statistics().path(), { query });
  }
}
