import { Augur } from "../Augur";
import { DB } from "./db/DB";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";

const settings = require("@augurproject/sdk/src/state/settings.json");

export class Controller {

  public constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: BlockAndLogStreamerListener,
  ) {
  }

  public async fullTextSearch(eventName: string, query: string) {
    const db = await this.db;
    return db.fullTextSearch(eventName, query);
  }

  public async run(): Promise<void> {
    try {
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
