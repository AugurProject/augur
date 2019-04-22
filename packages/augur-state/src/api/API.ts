import { Augur } from "@augurproject/api";
import { DB } from "../db/DB";
import { Router } from "./Router";

// Getters are evaluated by importing these files in this manner
import "./Markets";
import "./Ping";
import "./Trading";
import "./Users";

export class API<TBigNumber> {
  private readonly router: Router<TBigNumber>;

  constructor(augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.router = new Router<TBigNumber>(augurAPI, db);
  }

  public async route(name: string, params: any) {
    return this.router.route(name, params);
  }
}
