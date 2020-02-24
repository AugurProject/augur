import { Log } from '@augurproject/types';
import { WarpController } from '../../warp/WarpController';
import _ from 'lodash';
import { Address } from '../logs/types';

export class WarpSyncStrategy {
  constructor(
    protected warpSyncController: WarpController,
    protected onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>
  ) {}

  async pinHashByGatewayUrl(url: string) {
    return this.warpSyncController.pinHashByGatewayUrl(url);
  }

  async start(ipfsRootHash?: string): Promise<number | undefined> {
    // No hash, nothing to do!
    if (!ipfsRootHash) return undefined;

    await this.warpSyncController.createInitialCheckpoint();
    return this.loadCheckpoints(ipfsRootHash);
  }

  async loadCheckpoints(ipfsRootHash: string): Promise<number | undefined> {
    const availableCheckpoints = await this.warpSyncController.getAvailableCheckpointsByHash(ipfsRootHash);
    const { begin } = await this.warpSyncController.getMostRecentCheckpoint();

    const checkpointsToSync = availableCheckpoints.filter((item) => item >= begin.number);
    let maxBlockNumber;
    for (let i = 0; i < checkpointsToSync.length; i++) {
      const logs = await this.warpSyncController.getCheckpointFile(ipfsRootHash, checkpointsToSync[i]);
      maxBlockNumber = await this.processFile(logs);
    }

    return maxBlockNumber;
  }

  async processFile(buffer: string): Promise<number | undefined> {
    const splitLogs = JSON.parse(buffer);

    const maxBlockNumber = _.maxBy<number>(_.map(splitLogs, 'blockNumber'), item =>
      Number(item));
    const sortedLogs = _.orderBy(splitLogs, ['blockNumber', 'logIndex'], ['asc', 'asc']);

    await this.onLogsAdded(maxBlockNumber, sortedLogs);

    return maxBlockNumber;
  }
}
