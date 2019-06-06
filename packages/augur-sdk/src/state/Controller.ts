import {Augur} from "../Augur";
import {PouchDBFactoryType} from "./db/AbstractDB";
import {DB} from "./db/DB";
import {BlockAndLogStreamerListener} from "./db/BlockAndLogStreamerListener";

const settings = require("./settings.json");

export class Controller {
  public db: Promise<DB>;

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

  public async fullTextSearch(eventName: string, query: string) {
    const db = await this.db;
    return db.fullTextSearch(eventName, query);
  }

  public createDb() {
    this.db = DB.createAndInitializeDB(
      this.networkId,
      this.blockstreamDelay,
      this.defaultStartSyncBlockNumber,
      this.trackedUsers,
      this.augur.genericEventNames,
      this.augur.customEvents,
      this.augur.userSpecificEvents,
      this.pouchDBFactory,
      this.blockAndLogStreamerListener,
    );
  }

  public async run(): Promise<void> {
    try {
      this.db =  DB.createAndInitializeDB(
        this.networkId,
        this.blockstreamDelay,
        this.defaultStartSyncBlockNumber,
        this.trackedUsers,
        this.augur.genericEventNames,
        this.augur.customEvents,
        this.augur.userSpecificEvents,
        this.pouchDBFactory,
        this.blockAndLogStreamerListener,
      );
      const db = await this.db;
      db.sync(
        this.augur,
        settings.chunkSize,
        settings.blockstreamDelay,
      );

      this.blockAndLogStreamerListener.listenForBlockRemoved(db.rollback.bind(db));
      this.blockAndLogStreamerListener.startBlockStreamListener();
    } catch (err) {
      console.log(err);
    }
  }
}
