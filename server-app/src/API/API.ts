import { Application, json, Request, Router } from "express";
import BaseAPI from './BaseAPI';

export default class API extends BaseAPI {
  route: string = '/api';

  initRoutes() {
    this.router.get('/', (req, res) => {
      this.db.one('SELECT * FROM users')
      .then(function (data) {
        res.send(data)
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
    })
  }
}