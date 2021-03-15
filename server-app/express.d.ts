import { User } from "@doer/entities";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}