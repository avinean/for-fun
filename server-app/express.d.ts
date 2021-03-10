import { User } from "@doer/entities";

declare namespace Express {
  export interface Request {
    user?: User;
  }
}