import express from 'express';
import path from 'path';
import API from './API/API';

interface Params {
  port: number;
  host: string;
}
class App {
  public app: express.Application;
  private params: Params = {
    port: 8080,
    host: '127.0.0.1',
  };

  constructor() {
    this.app = express();
    this.config();
    this.initAPI();
  }

  private config(): void {
    
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
