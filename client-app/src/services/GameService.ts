import { Game, Routes, User } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class GameService extends BaseService {
  getGames(): Promise<Game[]> {
    return this.get<Game[]>(Routes.Game);
  }
}
