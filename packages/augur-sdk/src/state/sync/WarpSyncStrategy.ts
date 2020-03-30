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

  async start(ipfsRootHash?: string, highestSyncedBlock = 0): Promise<number | undefined> {
    await this.warpSyncController.createInitialCheckpoint();

    // This is the warp hash for the value '0' which means there isn't yet a finalized hash.
    if (ipfsRootHash && ipfsRootHash !== 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51') {
      return this.loadCheckpoints(ipfsRootHash, highestSyncedBlock);
    } else { // No hash, nothing more to do!
      return undefined;
    }
  }

  async loadCheckpoints(ipfsRootHash: string, highestSyncedBlock:number): Promise<number | undefined> {
    const availableCheckpoints = await this.warpSyncController.getAvailableCheckpointsByHash(ipfsRootHash);
    const { begin } = await this.warpSyncController.getMostRecentCheckpoint();

    const checkpointsToSync = availableCheckpoints.filter((item) => Number(item.Name) >= begin.number);
    let maxBlockNumber;

    for (let i = 0; i < checkpointsToSync.length; i++) {
      const {
        endBlockNumber, logs
      } = await this.warpSyncController.getCheckpointFile(ipfsRootHash, checkpointsToSync[i].Name);
      await this.processFile(logs, highestSyncedBlock);
      await this.warpSyncController.updateCheckpointDbByNumber(endBlockNumber, checkpointsToSync[i]);
      maxBlockNumber= endBlockNumber;
    }

    return maxBlockNumber;
  }
  async processFile(logs: Log[], highestSyncedBlock:number): Promise<number | undefined> {
    const filteredLogs = logs.filter(log => log.blockNumber > highestSyncedBlock);
    const maxBlockNumber = _.maxBy<number>(_.map(filteredLogs, 'blockNumber'), item =>
      Number(item));
    const sortedLogs = _.orderBy(filteredLogs, ['blockNumber', 'logIndex'], ['asc', 'asc']);

    await this.onLogsAdded(maxBlockNumber, sortedLogs);

    return maxBlockNumber;
  }
}
