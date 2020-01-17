import { Filter, Log, ParsedLog } from '@augurproject/types';
import { Block } from 'ethereumjs-blockstream';
import {
  BlockAndLogStreamerInterface,
  ExtendedFilter,
} from './BlockAndLogStreamerSyncStrategy';

export abstract class AbstractSyncStrategy {
  constructor(
    protected getLogs: (filter: Filter) => Promise<Log[]>,
    protected buildFilter: () => ExtendedFilter,
    protected onLogsAdded: (blockNumber: number, logs: ParsedLog[]) => Promise<void>
  ) {}

  // Returns the block number of the last block synced
  abstract start(blockNumber: number, endBlockNumber?: number): Promise<number>;
}
