import { ParsedLog } from '@augurproject/types';
import { Block } from 'ethers/providers';
import * as fp from 'lodash/fp';
import { Augur } from '../Augur';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { BlockAndLogStreamerListenerInterface } from './db/BlockAndLogStreamerListener';
import { DB } from './db/DB';
import { Markets } from './getter/Markets';

const settings = require('./settings.json');

export class Controller {
  private static latestBlock: Block;
  private static throttled: any;

  private readonly events;

  constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private blockAndLogStreamerListener: BlockAndLogStreamerListenerInterface
  ) {
    this.events = new Subscriptions(augur.getAugurEventEmitter());
  }

  async run(): Promise<void> {
    try {
      this.blockAndLogStreamerListener.listenForAllEvents(this.updateMarketsData);
      this.blockAndLogStreamerListener.notifyNewBlockAfterLogsProcess(this.notifyNewBlockEvent.bind(this));

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
      fp.compact,
      fp.uniq,
      fp.map('market')
    )(allLogs);

    if(logMarketIds.length === 0) return;

    const marketsInfo = await Markets.getMarketsInfo(this.augur, await this.db, {
      marketIds: logMarketIds
    });

    this.augur.getAugurEventEmitter().emit(SubscriptionEventName.MarketsUpdated,  {
      marketsInfo
    });
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
    this.augur.getAugurEventEmitter().emit(SubscriptionEventName.NewBlock, {
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
