import express from 'express';
import path from 'path';
import API from './API/API';
import MainView from './Views/MainView';

interface Params {
  port: number;
  host: string;
}

class App {
  public app: express.Application;
  private params: Params = {
    port: 8080,
    host: '0.0.0.0',
  };

  constructor() {
    this.app = express();
    this.config();
    this.initAPI();
    this.initViews();
  }

  private config(): void {
    this.app.use(express.static(path.join(__dirname + '/public')));
  }

  private initViews(): void {
    new MainView().mount(this.app);
  }

  private initAPI(): void {
    new API().mount(this.app);
  }
  
  public run(): void {
    const { port, host } = this.params;
    this.app.listen(port, host);
    console.log(`running on http://${host}:${port}`);
  }

}

export default new App();
