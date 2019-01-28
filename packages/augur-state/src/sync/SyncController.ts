import { DB } from '../db/DB';
import { Augur } from 'augur-api';

export class SyncController<TBigNumber> {
  private readonly db: DB<TBigNumber>;
  private readonly augur: Augur<TBigNumber>;

  public constructor (db: DB<TBigNumber>, augur: Augur<TBigNumber>) {
    this.db = db;
    this.augur = augur;
  }

  public async beginSync(chunkSize: number, blockstreamDelay: number): Promise<void> {
    this.db.sync(this.augur, chunkSize, blockstreamDelay);
  }
}
