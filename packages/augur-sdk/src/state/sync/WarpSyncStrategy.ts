import { Log, ParsedLog } from '@augurproject/types';
import { WarpController } from '../../warp/WarpController';
import _ from 'lodash';

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

    const checkpointsToSync = availableCheckpoints.filter((item) => Number(item.Name) >= begin.number);
    let maxBlockNumber;
    for (let i = 0; i < checkpointsToSync.length; i++) {
      const {
        endBlockNumber, logs
      } = await this.warpSyncController.getCheckpointFile(ipfsRootHash, checkpointsToSync[i].Name);
      await this.processFile(logs);
      await this.warpSyncController.updateCheckpointDbByNumber(endBlockNumber, endBlockNumber + 1, checkpointsToSync[i]);
      maxBlockNumber= endBlockNumber;
    }

    return maxBlockNumber;
  }
  async processFile(logs: Log[]): Promise<number | undefined> {
    const maxBlockNumber = _.maxBy<number>(_.map(logs, 'blockNumber'), item =>
      Number(item));
    const sortedLogs = _.orderBy(logs, ['blockNumber', 'logIndex'], ['asc', 'asc']);

    await this.onLogsAdded(maxBlockNumber, sortedLogs);

    return maxBlockNumber;
  }
}
