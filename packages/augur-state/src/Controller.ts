import { DB } from './db/DB';
import { SyncController } from './sync/SyncController';
import { Augur } from 'augur-api';

export class Controller<TBigNumber> {
  private readonly dbName: string;
  private dbController: DB<TBigNumber>;
  private syncController: SyncController<TBigNumber>;
  private augur: Augur<TBigNumber>;

  public constructor (dbName: string, augur: Augur<TBigNumber>) {
    this.dbName = dbName;
    this.augur = augur;
  }

  public async run(): Promise<void> {
    this.dbController = await DB.createAndInitializeDB();
    this.syncController = new SyncController<TBigNumber>(this.dbController, this.augur);
    await this.syncController.beginSync(10000, 5);
    // TODO begin server process
  }
}
