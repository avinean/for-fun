export interface Message {
  id?: number;
  chatId?: number;
  userId: number;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}