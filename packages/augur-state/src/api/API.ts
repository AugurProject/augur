import { Augur } from "augur-api";
import { DB } from "../db/DB";
import { Markets } from "./Markets"
import { Users } from "./Users"

export class API<TBigNumber> {
  private readonly augurAPI: Augur<TBigNumber>;
  private readonly db: DB<TBigNumber>;

  public readonly markets: Markets;
  public readonly users: Users;

  public constructor (augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.augurAPI = augurAPI;
    this.db = db;
    this.markets = new Markets();
    this.users = new Users();
  }
}
