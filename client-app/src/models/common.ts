export interface QueryOptions {
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export interface Game {
  image: string;
  name: string;
  stringId: string;
  isUnderDevelopment: boolean;
}
