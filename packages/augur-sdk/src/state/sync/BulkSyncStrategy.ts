import { Filter, Log, ParsedLog } from '@augurproject/types';
import * as _ from 'lodash';
import { ExtendedFilter, LogCallbackType } from '../logs/LogFilterAggregator';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';
import { chunkRange } from '@augurproject/utils';

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
    if(startBlockNumber > endBlockNumber) throw new Error('Starting point of bulk sync must be less than or equal to the endpoint')

    console.log(`Syncing from ${startBlockNumber} to ${endBlockNumber}`);
    for(const [fromBlock, toBlock] of chunkRange(startBlockNumber, endBlockNumber, this.chunkSize)) {
      const logs = await this.getLogs({
        address: this.contractAddresses,
        fromBlock,
        toBlock,
      });

      const sortedLogs = _.orderBy(logs, ['blockNumber', 'logIndex'], ['asc', 'asc']);

      const label = `${fromBlock}-${toBlock}`
      console.time(label);
      await this.onLogsAdded(toBlock, this.parseLogs(sortedLogs));
      console.timeEnd(label);
    }

    return endBlockNumber;
  }
}
