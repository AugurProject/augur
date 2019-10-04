import { ParsedLog } from '@augurproject/types';
import { Block } from 'ethers/providers';
import * as fp from 'lodash/fp';
import { Augur } from '../Augur';
import { SubscriptionEventName } from '../constants';
import { augurEmitter } from '../events';
import { Subscriptions } from '../subscriptions';
import { IBlockAndLogStreamerListener } from './db/BlockAndLogStreamerListener';
import { DB } from './db/DB';

const settings = require('./settings.json');

export class Controller {
  private static latestBlock: Block;
  private static throttled: any;

  private readonly events = new Subscriptions(augurEmitter);

  constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: IBlockAndLogStreamerListener
  ) {
  }

  async run(): Promise<void> {
    try {
      this.events.subscribe('controller:new:block', this.notifyNewBlockEvent.bind(this));
      this.blockAndLogStreamerListener.listenForAllEvents(this.updateMarketsData);

      const db = await this.db;
      await db.sync(this.augur, settings.chunkSize, settings.blockstreamDelay);

      this.blockAndLogStreamerListener.listenForBlockRemoved(
        db.rollback.bind(db)
      );
      this.blockAndLogStreamerListener.startBlockStreamListener();
    } catch (err) {
      console.log(err);
    }
  }

  private updateMarketsData = async (blockNumber: number, allLogs: ParsedLog[]) => {
    // Grab market ids from all logs.
    // Compose applies operations from bottom to top.
    const logMarketIds = fp.compose(
      fp.uniq,
      fp.map('market')
    )(allLogs);

    if(logMarketIds.length === 0) return;

    const marketsInfo = await this.augur.getMarketsInfo({
      marketIds: logMarketIds
    });
    augurEmitter.emit(SubscriptionEventName.MarketsUpdated, marketsInfo);
  };

  private notifyNewBlockEvent = async (): Promise<void> => {
    let lowestBlock = await (await this
      .db).syncStatus.getLowestSyncingBlockForAllDBs();
    const block = await this.getLatestBlock();

    if (lowestBlock === -1) {
      lowestBlock = block.number;
    }

    const blocksBehindCurrent = block.number - lowestBlock;
    const percentSynced = ((lowestBlock / block.number) * 100).toFixed(4);

    const timestamp = await this.augur.getTimestamp();
    augurEmitter.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: block.number,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentSynced,
      timestamp: timestamp.toNumber(),
    });
  };

  private async getLatestBlock(): Promise<Block> {
    const blockNumber: number = await this.augur.provider.getBlockNumber();
    Controller.latestBlock = await this.augur.provider.getBlock(blockNumber);

    return Controller.latestBlock;
  }
}
