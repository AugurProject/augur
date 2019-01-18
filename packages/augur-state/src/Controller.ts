import { DBController } from './db/DBController';
import { SyncController } from './sync/SyncController';
import { Augur } from 'augur-api';

export class Controller<TBigNumber> {
  private readonly dbName: string;
  private dbController: DBController;
  private syncController: SyncController<TBigNumber>;
  private augur: Augur<TBigNumber>;

  public constructor (dbName: string, augur: Augur<TBigNumber>) {
    this.dbName = dbName;
    this.augur = augur;
  }

  public async run(): Promise<void> {
    this.dbController = await DBController.createAndInitializeDB(this.dbName);
    this.syncController = new SyncController<TBigNumber>(this.dbController, this.augur);
    await this.syncController.beginSync();
    // TODO begin server process
  }
}
