export interface User {
  id: number;
  email: string;
  nickname: string;
  name: string;
  lastName: string;
  age: number;
  hash: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  lastAuthorization: string;
  isOnline: boolean;
  token: string;
  confirmed: boolean;
  pass?: string;
}
