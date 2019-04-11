import { Augur } from "@augurproject/api";
import { DB } from "../db/DB";
import { Markets } from "./Markets";
import { Users } from "./Users";
import { Trading } from "./Trading";

export class API<TBigNumber> {
  private readonly augurAPI: Augur<TBigNumber>;
  private readonly db: DB<TBigNumber>;

  public readonly markets: Markets;
  public readonly users: Users<TBigNumber>;
  public readonly trading: Trading<TBigNumber>;

  public constructor (augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.augurAPI = augurAPI;
    this.db = db;
    this.markets = new Markets();
    this.users = new Users<TBigNumber>(this.db);
    this.trading = new Trading<TBigNumber>(this.db);
  }
}
