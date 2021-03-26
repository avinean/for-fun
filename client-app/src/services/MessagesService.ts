import { MessageObject, Routes } from '@doer/entities';
import BaseService from '@/services/BaseService';

export default class MessageService extends BaseService {
  getMessages(): Promise<MessageObject[]> {
    return this.get<MessageObject[]>(Routes.Message);
  }
}
