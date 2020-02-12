import { ExtendedFilter, LogCallbackType } from '../logs/LogFilterAggregator';

export interface SyncStrategy {
  start(blockNumber: number, endBlockNumber?: number): Promise<number>;
}
