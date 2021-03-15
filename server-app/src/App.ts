import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Routes } from '@doer/entities';
import API from './API/API';
import PublicAPI from './API/PublicAPI';
import UserAPI from './API/UserAPI';
import secret from './secret/auth';

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
    this.app.use(async (req, res, next) => {
      if (req.path.includes(Routes.PublicApi)) {
        next();
      } else {
        if (!req.headers.authorization) {
          res.status(403).send({ error: 'Authorization is required'});
          return;
        }

        const token = req.headers.authorization.replace('Bearer ', '');
        try {
          const user = await secret.confirm(token);
          req.user = { ...user };
        } catch (e) {
          res.status(403).send({ error: 'Authorization is required'});
          return;
        }
        next();
      }
    });
  }

  private initAPI(): void {
    this.app.use(Routes.PublicApi, new PublicAPI().router);
    this.app.use(Routes.Api, new UserAPI().router);
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

