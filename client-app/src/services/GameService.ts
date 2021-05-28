import { Game, GameHistory, Routes } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class GameService extends BaseService {
  getGames(): Promise<Game[]> {
    return this.get<Game[]>(Routes.Game);
  }

  setGameStatistic<T>(params: GameHistory<T>): Promise<void> {
    return this.post<void>(`${Routes.Game}${Routes.History}`, { params });
  }
}
