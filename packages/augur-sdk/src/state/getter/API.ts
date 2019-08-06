import { Augur } from "../../Augur";
import { DB } from "../db/DB";
import { Router } from "./Router";

// Getters are evaluated by importing these files in this manner
import "./Markets";
import "./Ping";
import "./Trading";
import "./Users";
import "./Accounts";
import "./status";
import "./get-account-time-ranged-stats";

export class API {
  private readonly router: Router;
  public db: Promise<DB>;

  constructor(augur: Augur, db: Promise<DB>) {
    this.db = db;
    this.router = new Router(augur, db);
  }

  async route(name: string, params: any) {
    return this.router.route(name, params);
  }
}
