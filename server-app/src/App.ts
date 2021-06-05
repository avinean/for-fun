import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { routerHelper } from '@doer/entities';
import PublicAPI from './API/PublicAPI';
import UserAPI from './API/UserAPI';
import secret from './Services/AuthService';
import BaseAPI from './API/BaseAPI';
import ChatAPI from './API/MessageAPI';
import SocketsAPI from './SocketsAPI/SocketsAPI';
import MessageAPI from './API/MessageAPI';
import GameAPI from './API/GameAPI';
import GameStatisticsAPI from './API/GameStatisticsAPI';

interface Params {
  port: number;
  host: string;
}
class App {
  private readonly app: express.Application;

  private readonly http: http.Server;

  private params: Params = {
    port: 5000,
    host: '127.0.0.1',
  };

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.config();
    this.initAPI();
    this.initSockets();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    // test
    this.app.use((_, __, next) => {
      setTimeout(next, 2000);
    });
    // logger
    this.app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.originalUrl} ${new Date().toISOString()}`);
      next();
    });
    // authorize
    this.app.use(async (req, res, next) => {
      if (req.path.includes(routerHelper.publicApi().path())) {
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
    this.addController(routerHelper.publicApi().path(), new PublicAPI());
    this.addController(routerHelper.api().user().path(), new UserAPI());
    this.addController(routerHelper.api().chat().path(), new ChatAPI());
    this.addController(routerHelper.api().message().path(), new MessageAPI());
    this.addController(routerHelper.api().game().path(), new GameAPI());
    this.addController(routerHelper.api().game().statistics().path(), new GameStatisticsAPI());

    this.app.all('*', (req, res, next) => {
      res.send(404);
    });
  }

  private initSockets(): void {
    new SocketsAPI(this.http);
  }

  private addController(route: string, instance: BaseAPI): void {
    this.app.use(route, instance.router);
  }

  public run(): void {
    const { port, host } = this.params;
    this.http.listen(port, () => {
      console.log(`running on http://${host}:${port}`)
    });
  }

}

export default new App();

