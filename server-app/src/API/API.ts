import { Application, json, Request, Router } from "express";

export default class API {
  router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', (req, res) => {
      res.json({
        test: 1,
        test1: 2
      });
    })
  }

  mount(app: Application): void {
    app.use('/api', this.router);
  }
}