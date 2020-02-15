import { ParsedLog } from '@augurproject/types';
import { Block } from 'ethers/providers';
import * as fp from 'lodash/fp';
import { Augur } from '../Augur';
import { SubscriptionEventName, NULL_ADDRESS } from '../constants';
import { Subscriptions } from '../subscriptions';
import { DB } from './db/DB';
import { Markets } from './getter/Markets';
import { LogFilterAggregatorInterface } from './logs/LogFilterAggregator';

const settings = require('./settings.json');

export class Controller {
  private static latestBlock: Block;

  private readonly events;

  constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private logFilterAggregator: LogFilterAggregatorInterface,
  ) {
    this.events = new Subscriptions(augur.events);
    this.logFilterAggregator.listenForAllEvents(this.allEvents);
    this.logFilterAggregator.notifyNewBlockAfterLogsProcess(this.notifyNewBlockEvent.bind(this));

    db.then((dbObject) => {
      logFilterAggregator.listenForBlockRemoved(
        dbObject.rollback.bind(db)
      );
    });
  }

  private updateMarketsData = async (marketIds: string[]) => {
    console.log('marketIds', marketIds.length);
    const marketsInfo = await Markets.getMarketsInfo(this.augur, await this.db, {
      marketIds
    });

    this.augur.events.emit(SubscriptionEventName.MarketsUpdated,  {
      marketsInfo
    });
  };

  private allEvents = async (blockNumber: number, allLogs: ParsedLog[]) => {
    // Grab market ids from all logs.
    // Compose applies operations from bottom to top.
    const logMarketIds = fp.compose(
      fp.compact,
      fp.uniq,
      fp.filter(NULL_ADDRESS),
      fp.map('market')
    )(allLogs);

    if(logMarketIds.length > 0) this.updateMarketsData(logMarketIds as string[]);
    // emit non market related logs
    allLogs.forEach(l => l.market === NULL_ADDRESS && this.augur.events.emit(l.name, {...l}));
  }

  private notifyNewBlockEvent = async (blockNumber: number): Promise<void> => {
    let lowestBlock = await (await this
      .db).syncStatus.getLowestSyncingBlockForAllDBs();

    if (lowestBlock === -1) {
      lowestBlock = blockNumber;
    }

    const blocksBehindCurrent = blockNumber - lowestBlock;
    const percentSynced = ((lowestBlock / blockNumber) * 100).toFixed(4);

    const timestamp = await this.augur.getTimestamp();
    this.augur.events.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: blockNumber,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentSynced,
      timestamp: timestamp.toNumber(),
    });
  };

  private async getLatestBlock(): Promise<Block> {
    const blockNumber: number = await this.augur.provider.getBlockNumber();
    Controller.latestBlock = await this.augur.provider.getBlock(blockNumber);
    if (!Controller.latestBlock) {
      throw new Error(`Could not get latest block: ${blockNumber}`);
    }

    return Controller.latestBlock;
  }
}
