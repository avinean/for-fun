import { User } from "./user";

export interface Message {
  id?: number;
  chatId?: number;
  userId: number;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageObject {
  message: Message;
  user: User;
}