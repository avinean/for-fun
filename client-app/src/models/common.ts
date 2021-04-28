export interface QueryOptions {
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export enum PageRoutes {
  Home = '/',
  Auth = '/auth',
  Registration = 'registration',
  ConfirmEmail = 'confirm-email',
  RestorePassword = 'restore-password',
  ResetPassword = 'reset-password',
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
