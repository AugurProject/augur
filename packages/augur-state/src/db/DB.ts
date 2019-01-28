import { Markets } from './Markets'
import { OrderCreated } from './OrderCreated'
import { UserShareBalances } from './UserShareBalances'
import { AbstractSyncableDB } from './AbstractSyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import chunk = require('lodash/chunk');

export class DB<TBigNumber> {
  private syncableDatabases: Array<AbstractSyncableDB<TBigNumber>> = [];

  public syncStatus: SyncStatus;
  public markets: Markets<TBigNumber>;
  public orderCreated: OrderCreated<TBigNumber>;
  public userShareBalances: UserShareBalances<TBigNumber>;

  public constructor () {}

  public static async createAndInitializeDB<TBigNumber>(): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    dbController.initializeDB();
    return dbController;
  }

  public async initializeDB(): Promise<void> {
    this.syncStatus = new SyncStatus();
    this.markets = new Markets<TBigNumber>(this);
    this.orderCreated = new OrderCreated<TBigNumber>(this);
    // TODO Should be PER USER
    this.userShareBalances = new UserShareBalances(this);
  }

  public notifySyncableDBAdded(db: AbstractSyncableDB<TBigNumber>): void {
    this.syncableDatabases.push(db);
  }

  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number): Promise<void> {
    this.markets.sync(augur, chunkSize, blockstreamDelay);
    this.orderCreated.sync(augur, chunkSize, blockstreamDelay);
    // TODO Sync all DBs
    //for (let db of this.syncableDatabases) {
    //  db.sync(augur);
    //}
  }
}
