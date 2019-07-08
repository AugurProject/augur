import { Augur } from "../Augur";
import { DB } from "./db/DB";
import { IBlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
import { Block } from "ethers/providers";
import { augurEmitter } from "../events";
import { SubscriptionEventName } from "../constants";
import { Subscriptions } from "../subscriptions";

const settings = require("./settings.json");

export class Controller {
  private static latestBlock: Block;
  private static db: Promise<DB>;
  private static augur: Augur;

  private events = new Subscriptions(augurEmitter);

  public constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: IBlockAndLogStreamerListener,
  ) {
    Controller.db = db;
    Controller.augur = augur;
  }

  public async fullTextSearch(eventName: string, query: string) {
    const db = await this.db;
    return db.fullTextSearch(eventName, query);
  }

  public async run(): Promise<void> {
    try {
      this.events.subscribe("controller:new:block", this.notifyNewBlockEvent);

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

  private async notifyNewBlockEvent(): Promise<void> {
    const lowestBlock = await (await Controller.db).syncStatus.getLowestSyncingBlockForAllDBs();
    const block = await Controller.getLatestBlock();

    const blocksBehindCurrent = (block.number - lowestBlock);
    const percentBehindCurrent = (blocksBehindCurrent / block.number * 100).toFixed(4);

    augurEmitter.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: block.number,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentBehindCurrent,
      timestamp: block.timestamp,
    });
  }

  private static async getLatestBlock(): Promise<Block> {
    if (Controller.latestBlock) {
      return Controller.latestBlock;
    } else {
      const blockNumber: number = await Controller.augur.provider.getBlockNumber();
      Controller.latestBlock = await Controller.augur.provider.getBlock(blockNumber);

      return Controller.latestBlock;
    }
  }
}
