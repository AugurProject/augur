import { SyncableDB } from './SyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { UserSyncableDB } from './UserSyncableDB';

export class DB<TBigNumber> {
  private syncableDatabases: Array<SyncableDB<TBigNumber>> = [];

  public syncStatus: SyncStatus;
  public trackedUsers: TrackedUsers;
  public marketCreated: SyncableDB<TBigNumber>;
  public marketFinalized: SyncableDB<TBigNumber>;

  public userTokensMinted: { [user: string]: UserSyncableDB<TBigNumber>} = {};

  public constructor () {}

  public static async createAndInitializeDB<TBigNumber>(): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    await dbController.initializeDB();
    return dbController;
  }

  public async initializeDB(): Promise<void> {
    this.syncStatus = new SyncStatus();
    this.trackedUsers = new TrackedUsers();

    // TODO:Remove. Here for testing
    this.trackedUsers.setUserTracked("0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb");

    this.marketCreated = new SyncableDB<TBigNumber>(this, "MarketCreated");
    this.marketFinalized = new SyncableDB<TBigNumber>(this, "MarketFinalized");

    const trackedUsers = await this.trackedUsers.getUsers();
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party
    for (let trackedUser of trackedUsers) {
      this.userTokensMinted[trackedUser] = new UserSyncableDB<TBigNumber>(this, "TokensTransferred", trackedUser, 3, 2);
    }
  }

  public notifySyncableDBAdded(db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases.push(db);
  }

  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number, uploadBlockNumber: number): Promise<void> {
    for (let db of this.syncableDatabases) {
      db.sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber);
    }
  }
}
