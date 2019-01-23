import { Markets } from './Markets'
import { Trades } from './Trades'
import { UserShareBalances } from './UserShareBalances'

export class DB {
  public markets: Markets;
  public trades: Trades;
  public userShareBalances: UserShareBalances;

  public constructor () {}

  public static async createAndInitializeDB(): Promise<DB> {
    const dbController = new DB();
    dbController.initializeDB();
    return dbController;
  }

  public async initializeDB(): Promise<void> {
    this.markets = new Markets();
    this.trades = new Trades();
    // Should be PER USER
    this.userShareBalances = new UserShareBalances();
  }
}
