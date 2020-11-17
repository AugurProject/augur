import { Filter, Log, ParsedLog } from '@augurproject/types';
import * as _ from 'lodash';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';
import { chunkRange } from '@augurproject/utils';

export class BulkSyncStrategy extends AbstractSyncStrategy implements SyncStrategy {
  constructor(
    getLogs: (filter: Filter) => Promise<Log[]>,
    contractAddresses: string[],
    onLogsAdded: (blockNumber: number, logs: ParsedLog[]) => Promise<void>,
    protected parseLogs:(logs: Log[]) => ParsedLog[],
    protected chunkSize = 1000000,
  ) {
    super(getLogs, contractAddresses, onLogsAdded);
  }

  async start(
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<number> {
    if(!endBlockNumber) throw new Error('Cannot bulk sync forever. Please pass in an ending block for the syncing range.');
    if(startBlockNumber > endBlockNumber) throw new Error(`Attempting to bulk sync logs starting at block ${startBlockNumber}, but ethereum says the current block number is ${endBlockNumber}, which is before ${startBlockNumber}. If you're in development mode and restarted your eth node, make sure to clear your browser's IndexDB state before continuing. If you're connected to hosted testnet infrastructure, then something is wrong and it is returning an old value for eth_blockNumber.`)

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
