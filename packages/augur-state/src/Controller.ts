import { DB } from './db/DB';
import { Augur } from 'augur-api';

// TODO get from augur API
const UPLOAD_BLOCK_NUMBER = 2687175;

export class Controller<TBigNumber> {
  private dbController: DB<TBigNumber>;
  private augur: Augur<TBigNumber>;

  public constructor (augur: Augur<TBigNumber>) {
    this.augur = augur;
  }

  public async run(): Promise<void> {
    this.dbController = await DB.createAndInitializeDB();
    await this.dbController.sync(this.augur, 100000, 5, UPLOAD_BLOCK_NUMBER);
    // TODO begin server process
  }
}
