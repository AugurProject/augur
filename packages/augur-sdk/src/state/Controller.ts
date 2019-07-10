import { Augur } from '../Augur';
import { DB } from './db/DB';
import { IBlockAndLogStreamerListener } from './db/BlockAndLogStreamerListener';
import { Block } from 'ethers/providers';
import { augurEmitter } from '../events';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';

const settings = require('./settings.json');

export class Controller {
  private static latestBlock: Block;

  private events = new Subscriptions(augurEmitter);

  public constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: IBlockAndLogStreamerListener
  ) {}

  public async fullTextSearch(eventName: string, query: string) {
    const db = await this.db;
    return db.fullTextSearch(eventName, query);
  }

  public async run(): Promise<void> {
    try {
      this.events.subscribe('controller:new:block', this.notifyNewBlockEvent);

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
    const percentBehindCurrent = (
      (lowestBlock / block.number) *
      100
    ).toFixed(4);

    augurEmitter.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: block.number,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentBehindCurrent,
      timestamp: block.timestamp,
    });
  };

  private async getLatestBlock(): Promise<Block> {
    if (Controller.latestBlock) {
      return Controller.latestBlock;
    } else {
      const blockNumber: number = await this.augur.provider.getBlockNumber();
      Controller.latestBlock = await this.augur.provider.getBlock(blockNumber);

      return Controller.latestBlock;
    }
  }
}
