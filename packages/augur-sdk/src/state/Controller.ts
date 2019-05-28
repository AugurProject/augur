import { Augur } from "../Augur";
import { PouchDBFactoryType } from "./db/AbstractDB";
import { DB } from "./db/DB";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
const settings = require("./settings.json");

export class Controller {
  public db: DB;

  public constructor(
    private augur: Augur,
    private networkId: number,
    private blockstreamDelay: number,
    private defaultStartSyncBlockNumber: number,
    private trackedUsers: Array<string>,
    private pouchDBFactory: PouchDBFactoryType,
    private blockAndLogStreamerListener: BlockAndLogStreamerListener,
  ) {
  }

  public fullTextSearch(eventName: string, query: string): Array<object> {
    return this.db.fullTextSearch(eventName, query);
  }

  public async createDb() {
    this.db = await DB.createAndInitializeDB(
      this.networkId,
      this.blockstreamDelay,
      this.defaultStartSyncBlockNumber,
      this.trackedUsers,
      this.augur.genericEventNames,
      this.augur.userSpecificEvents,
      this.pouchDBFactory,
      this.blockAndLogStreamerListener,
    );
  }

  public async run(): Promise<void> {
    try {
      await this.createDb();

      await this.db.sync(
        this.augur,
        settings.chunkSize,
        settings.blockstreamDelay,
      );

      this.blockAndLogStreamerListener.listenForBlockRemoved(this.db.rollback.bind(this.db));
      this.blockAndLogStreamerListener.startBlockStreamListener();

      // TODO begin server process
    } catch (err) {
      console.log(err);
    }
  }
}
