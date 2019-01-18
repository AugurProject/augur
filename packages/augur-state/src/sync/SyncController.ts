import { DBController } from '../db/DBController';
import { Augur } from 'augur-api';

export class SyncController<TBigNumber> {
  private readonly dbController: DBController;
  private readonly augur: Augur<TBigNumber>;

  public constructor (dbController: DBController, augur: Augur<TBigNumber>) {
    this.dbController = dbController;
    this.augur = augur;
  }

  public async beginSync(): Promise<void> {
    const logs = await this.augur.events.getAugurLogs(2687175, 2700000);
    console.log(`GOT ${logs.length} logs`);
    // TODO get desired block range
    // TODO pull and process logs in chunks
    // TODO start blockstream to pull and process logs as they come in
  }
}
