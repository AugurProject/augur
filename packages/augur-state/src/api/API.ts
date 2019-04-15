import { Augur } from "@augurproject/api";
import { DB } from "../db/DB";
import { Router } from "./Router";

// Getters are evaluated by importing these files in this matter
import "./Markets";
import "./Trading";
import "./Users";

export class API<TBigNumber> {
  private readonly router: Router<TBigNumber>;

<<<<<<< HEAD
  constructor(augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.router = new Router<TBigNumber>(augurAPI, db);
  }
||||||| merged common ancestors
  public readonly markets: Markets;
  public readonly users: Users;
  public readonly trading: Trading<TBigNumber>;
=======
  public readonly markets: Markets<TBigNumber>;
  public readonly users: Users<TBigNumber>;
  public readonly trading: Trading<TBigNumber>;
>>>>>>> b140aebee9a44605156373c279ea7701c87d4530

<<<<<<< HEAD
  public route(name: string, params: any) {
    return this.router.route(name, params);
||||||| merged common ancestors
  public constructor (augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.augurAPI = augurAPI;
    this.db = db;
    this.markets = new Markets();
    this.users = new Users();
    this.trading = new Trading<TBigNumber>(this.db);
=======
  public constructor (augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.augurAPI = augurAPI;
    this.db = db;
    this.markets = new Markets<TBigNumber>(this.db);
    this.users = new Users<TBigNumber>(this.db);
    this.trading = new Trading<TBigNumber>(this.db);
>>>>>>> b140aebee9a44605156373c279ea7701c87d4530
  }
}
