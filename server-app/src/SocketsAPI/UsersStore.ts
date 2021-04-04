import { User } from "@doer/entities";

export interface UserConfig {
  socketId: string;
  user: User;
}

export interface UsersStoreInterface {
  users: UserConfig[];
  add(config: UserConfig): void;
  remove(userID: number): void;
  getBySocketID(socketId: string): UserConfig;
  getByUserID(userID: number): UserConfig;
}

export default {
  users: [],
  add(config: UserConfig) {
    const existConfig = this.getBySocketID(config.socketId) || this.getByUserID(config.user.id);
    if (existConfig) {
      Object.assign(existConfig, config)
    } else {
      this.users.push(config);
    }
  },
  remove(userID: number) {
    this.users = this.users.filter((config: UserConfig) => {
      return config.user.id !== userID;
    });
  },
  getBySocketID(socketId: string) {
    return this.users.find((config: UserConfig) => {
      return config.socketId === socketId;
    })
  },
  getByUserID(userID: number) {
    return this.users.find((config: UserConfig) => {
      return config.user.id === userID;
    })
  }
} as UsersStoreInterface;
