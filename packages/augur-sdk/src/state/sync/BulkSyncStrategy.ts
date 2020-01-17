import { Filter, Log, ParsedLog } from '@augurproject/types/build';
import * as _ from 'lodash';
import { ExtendedFilter, LogCallbackType } from '../logs/LogFilterAggregator';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';

export class BulkSyncStrategy extends AbstractSyncStrategy implements SyncStrategy {
  constructor(
    getLogs: (filter: Filter) => Promise<Log[]>,
    buildFilter: () => ExtendedFilter,
    onLogsAdded: (blockNumber: number, logs: ParsedLog[]) => Promise<void>,
    protected parseLogs:(logs: Log[]) => ParsedLog[],
    protected chunkSize = 100000,
  ) {
    super(getLogs, buildFilter, onLogsAdded);
  }

  async start(
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<number> {
    if(!endBlockNumber) throw new Error('Cannot bulk sync forever. Please pass in an endblock');

    console.log(`Syncing from ${startBlockNumber} to ${endBlockNumber}`);

    let highestSyncedBlockNumber = startBlockNumber;

    // Ethers doesn't support muliople addresses. Filter by topic
    // on node and filter by address on our side.
    // See: https://github.com/ethers-io/ethers.js/issues/473
    const { address, ...filter } = this.buildFilter();

    // With a wide open filter we get events from unknown sources.
    if (_.isEmpty(filter.topics)) throw new Error('Cannot bulk sync with an empty topics filter.');

    while(highestSyncedBlockNumber < endBlockNumber) {
      const logs = await this.getLogs({
        ...filter,
        fromBlock: highestSyncedBlockNumber,
        toBlock: Math.min(endBlockNumber, highestSyncedBlockNumber + this.chunkSize),
      });

      highestSyncedBlockNumber = Math.min(endBlockNumber, highestSyncedBlockNumber + this.chunkSize);
      const logsWeCareAbout = logs.filter(item => address.includes(item.address));

      await this.onLogsAdded(highestSyncedBlockNumber, this.parseLogs(logsWeCareAbout));
    }

    return endBlockNumber;
  }
}
