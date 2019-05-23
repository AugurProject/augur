import { Augur } from "../../Augur";
import { DB } from "../db/DB";
import { Router } from "./Router";

// Getters are evaluated by importing these files in this manner
import "./Markets";
import "./Ping";
import "./Trading";
import "./Users";

export class API {
  private readonly router: Router;

  constructor(augurAPI: Augur, db: DB) {
    this.router = new Router(augurAPI, db);
  }

  public async route(name: string, params: any) {
    return this.router.route(name, params);
  }
}
