interface RouteConfig {
  path: string;
  name: string;
}

export enum Params {
  Hash = 'hash',
  ID = 'id',
}

class RouterHelper {
  private names = [];

  private paths = [];

  // FE
  home() {return this.add({ name: 'Home', path: '' });}
  auth() {return this.add({ name: 'Auth', path: 'auth' });}
  registration() {return this.add({ name: 'Registration', path: 'registration' });}
  account() {return this.add({ name: 'Account', path: 'account' });}
  about() {return this.add({ name: 'About', path: 'about' });}
  games() {return this.add({ name: 'Games', path: 'games' });}
  statistics() {return this.add({ name: 'Statistics', path: 'statistics' });}


  // BE
  api() {return this.add({ name: 'Api', path: 'api' });}
  publicApi() {return this.add({ name: 'PublicApi', path: 'public-api' });}
  signIn() {return this.add({ name: 'SignIn', path: 'sign-in' });}
  signUp() {return this.add({ name: 'SignUp', path: 'sign-up' });}
  user() {return this.add({ name: 'User', path: 'user' });}
  chat() {return this.add({ name: 'Chat', path: 'chat' });}
  message() {return this.add({ name: 'Message', path: 'message' });}
  game() {return this.add({ name: 'Game', path: 'game' });}
  history() {return this.add({ name: 'History', path: 'history' });}
  resendEmailConfirmation() {return this.add({ name: 'ResendEmailConfirmation', path: 'resend-email-confirmation' });}

  // Uni
  confirmEmail() {return this.add({ name: 'ConfirmEmail', path: 'confirm-email' });}
  restorePassword() {return this.add({ name: 'RestorePassword', path: 'restore-password' });}
  resetPassword() {return this.add({ name: 'ResetPassword', path: 'reset-password' });}

  // Tools
  param(paramName: Params) {return this.add({ name: `:${paramName}`, path: `:${paramName}` });}
  dynamicPath(pathName: string | number) {return this.add({ name: `param ${pathName}`, path: `${pathName}` });}


  add({ name, path }: RouteConfig) {
    this.paths.push(path);
    this.names.push(name);
    return this;
  }

  path(): string {
    const { paths } = this;
    this.paths = [];
    this.names = [];
    return `/${paths.filter(Boolean).join('/')}`;
  }

  name(): string {
    const { names } = this;
    this.paths = [];
    this.names = [];
    return names.join('|');
  }

  get(): RouteConfig {
    const { names, paths } = this;
    this.paths = [];
    this.names = [];

    return {
      path: `/${paths.filter(Boolean).join('/')}`,
      name: names.join('|')
    }
  }

}

export const routerHelper = new RouterHelper();
