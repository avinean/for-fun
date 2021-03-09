import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import API from './API/API';
import PublicAPI from './API/PublicAPI';
import { Routes } from './Routes';

interface Params {
  port: number;
  host: string;
}
class App {
  public app: express.Application;
  private params: Params = {
    port: 5000,
    host: '127.0.0.1',
  };

  constructor() {
    this.app = express();
    this.config();
    this.initAPI();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    // logger
    this.app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.originalUrl} ${new Date().toISOString()}`);
      next();
    });
    // authorize
    this.app.use((req, res, next) => {
      next();
    });
  }

  private initAPI(): void {
    this.app.use(Routes.PublicApi, new PublicAPI().router);
    this.app.use(Routes.Api, new API().router);

    this.app.all('*', (req, res, next) => {
      res.send(404);
    });
  }
  
  public run(): void {
    const { port, host } = this.params;
    this.app.listen(port, host);
    console.log(`running on http://${host}:${port}`);
  }

}

export default new App();
