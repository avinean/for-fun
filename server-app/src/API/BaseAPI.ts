import { Application, json, Request, Router } from "express";
import pgPromise from "pg-promise";
import db from './../DataBase/DataBase'

export default class BaseAPI {
  router: Router = Router();
  route: string = '/api';
  db: pgPromise.IDatabase<any, any> = db;

  constructor() {
    this.initRoutes();
  }

  mount(app: Application): void {
    app.use(this.route, this.router);
  }

  initRoutes(): void {}
}