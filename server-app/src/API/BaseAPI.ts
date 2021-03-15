import { Application, json, Request, Router } from "express";
import pgPromise from "pg-promise";
import db from './../DataBase/DataBase'

export default class BaseAPI {
  private _router: Router = Router();
  private _db: pgPromise.IDatabase<any, any> = db;

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {}

  get router(): Router {
    return this._router;
  }
}