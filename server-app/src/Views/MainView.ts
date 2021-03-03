import { Application, Request, Response } from "express";
import path from 'path';

export default class MainView {
  public mount(app: Application) {
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname + '/../public/index.html'));
    });
  }
}