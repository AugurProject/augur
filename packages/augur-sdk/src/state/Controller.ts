import { Augur } from '../Augur';
import { DB } from './db/DB';
import { IBlockAndLogStreamerListener } from './db/BlockAndLogStreamerListener';
import { Block } from 'ethers/providers';
import { augurEmitter } from '../events';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { throttle } from "lodash";

const settings = require('./settings.json');

export class Controller {
  private static latestBlock: Block;
  private static throttled: any;

  private readonly events = new Subscriptions(augurEmitter);

  public constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: IBlockAndLogStreamerListener
  ) {
    Controller.throttled = throttle(this.notifyNewBlockEvent, 1000);
  }

  public async run(): Promise<void> {
    try {
      this.events.subscribe('controller:new:block', Controller.throttled);

      const db = await this.db;
      db.sync(this.augur, settings.chunkSize, settings.blockstreamDelay);

      this.blockAndLogStreamerListener.listenForBlockRemoved(
        db.rollback.bind(db)
      );
      this.blockAndLogStreamerListener.startBlockStreamListener();
    } catch (err) {
      console.log(err);
    }
  }

  private notifyNewBlockEvent = async (): Promise<void> => {
    let lowestBlock = await (await this
      .db).syncStatus.getLowestSyncingBlockForAllDBs();
    const block = await this.getLatestBlock();

    if (lowestBlock === -1) {
      lowestBlock = block.number;
    }

    const blocksBehindCurrent = block.number - lowestBlock;
    const percentSynced = (
      (lowestBlock / block.number) *
      100
    ).toFixed(4);

    augurEmitter.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: block.number,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentSynced,
      timestamp: block.timestamp,
    });
  }

  private async getLatestBlock(): Promise<Block> {
    const blockNumber: number = await this.augur.provider.getBlockNumber();
    Controller.latestBlock = await this.augur.provider.getBlock(blockNumber);

    return Controller.latestBlock;
  }
}
