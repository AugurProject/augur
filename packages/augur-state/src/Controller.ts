import { DB } from './db/DB';
import { Augur } from 'augur-api';

export class Controller<TBigNumber> {
  private dbController: DB<TBigNumber>;
  private augur: Augur<TBigNumber>;
  private networkId: number;
  private trackedUsers: Array<string>;

  public constructor (augur: Augur<TBigNumber>, networkId: number, trackedUsers: Array<string>) {
    this.augur = augur;
    this.networkId = networkId;
    this.trackedUsers = trackedUsers;
  }

  public async run(): Promise<void> {
    this.dbController = await DB.createAndInitializeDB(this.networkId, this.trackedUsers);
    await this.dbController.sync(this.augur, 100000, 5, this.networkId);
    // TODO begin server process
  }
}
