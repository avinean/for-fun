import { Application, json, Request, Response, Router } from "express";
import pgPromise from "pg-promise";
import db from '../DataBase/DataBase'

export default class BaseAPI {
  private _router: Router = Router();
  private _db: pgPromise.IDatabase<any, any> = db;

  constructor() {
    this.router.get('/', this.onGet.bind(this));
    this.router.post('/', this.onPost.bind(this));
    this.router.put('/', this.onPut.bind(this));
    this.router.delete('/', this.onDelete).bind(this);
  
    this.initRoutes();
  }

  initRoutes(): void {}

  onGet(req: Request, res: Response) {
    res.sendStatus(404);
  }

  onPost(req: Request, res: Response) {
    res.sendStatus(404);
  }

  onPut(req: Request, res: Response) {
    res.sendStatus(404);
  }

  onDelete(req: Request, res: Response) {
    res.sendStatus(404);
  }

  get router(): Router {
    return this._router;
  }

  protected get db() {
    return this._db;
  }
}