import { Filter, Log, ParsedLog } from '@augurproject/types/build';
import * as _ from 'lodash';
import { ExtendedFilter, LogCallbackType } from '../logs/LogFilterAggregator';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';

export class BulkSyncStrategy extends AbstractSyncStrategy implements SyncStrategy {
  constructor(
    getLogs: (filter: Filter) => Promise<Log[]>,
    contractAddresses: string[],
    onLogsAdded: (blockNumber: number, logs: ParsedLog[]) => Promise<void>,
    protected parseLogs:(logs: Log[]) => ParsedLog[],
    protected chunkSize = 100000,
  ) {
    super(getLogs, contractAddresses, onLogsAdded);
  }

  async start(
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<number> {
    if(!endBlockNumber) throw new Error('Cannot bulk sync forever. Please pass in an endblock');

    console.log(`Syncing from ${startBlockNumber} to ${endBlockNumber}`);

    let highestSyncedBlockNumber = startBlockNumber;

    while(highestSyncedBlockNumber < endBlockNumber) {
      const fromBlock = highestSyncedBlockNumber;
      const toBlock = Math.min(endBlockNumber, highestSyncedBlockNumber + this.chunkSize);
      const logs = await this.getLogs({
        address: this.contractAddresses,
        fromBlock,
        toBlock,
      });

      highestSyncedBlockNumber = Math.min(endBlockNumber, highestSyncedBlockNumber + this.chunkSize);

      const sortedLogs = _.orderBy(logs, ['blockNumber', 'logIndex'], ['asc', 'asc']);

      const label = `${highestSyncedBlockNumber}-${endBlockNumber}`
      console.time(label);
      await this.onLogsAdded(highestSyncedBlockNumber, this.parseLogs(sortedLogs));
      console.timeEnd(label);
    }

    return highestSyncedBlockNumber;
  }
}
