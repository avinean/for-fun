export interface QueryOptions {
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export enum PageRoutes {
  Home = '/',
  Account = '/account',
  About = '/about',
  Games = '/games',
}

export interface Game {
  image: string;
  name: string;
  stringId: string;
  isUnderDevelopment: boolean;
}
