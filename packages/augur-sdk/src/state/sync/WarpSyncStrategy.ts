import { Log, ParsedLog } from '@augurproject/types';
import { Block } from 'ethers/providers';
import { SECONDS_IN_A_DAY } from '../../constants';
import { WarpController } from '../../warp/WarpController';
import _ from 'lodash';

const BULKSYNC_HORIZON = SECONDS_IN_A_DAY.multipliedBy(7).toNumber();

export class WarpSyncStrategy {
  constructor(
    protected warpSyncController: WarpController,
    protected onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>
  ) {}

  async pinHashByGatewayUrl(url: string) {
    return this.warpSyncController.pinHashByGatewayUrl(url);
  }

  async start(
    ipfsRootHash?: string,
    highestSyncedBlock?: Block
  ): Promise<number | undefined> {
    await this.warpSyncController.createInitialCheckpoint();

    // This is the warp hash for the value '0' which means there isn't yet a finalized hash.
    if (
      ipfsRootHash &&
      ipfsRootHash !== 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'
    ) {
      return this.loadCheckpoints(ipfsRootHash, highestSyncedBlock);
    } else {
      // No hash, nothing more to do!
      return undefined;
    }
  }

  // @TODO update to blow away db and reload from checkpoints.
  async loadCheckpoints(
    ipfsRootHash: string,
    highestSyncedBlock?: Block
  ): Promise<number | undefined> {
    const mosteRecentWarpSync = await this.warpSyncController.getMostRecentWarpSync();
    if (
      !mosteRecentWarpSync ||
      highestSyncedBlock.timestamp - mosteRecentWarpSync.end.timestamp >
        BULKSYNC_HORIZON
    ) {
      // Blow it all away and refresh.
      await this.warpSyncController.destroyAndRecreateDB();

      const { logs } = await this.warpSyncController.getCheckpointFile(
        ipfsRootHash
      );
      return this.processFile(logs);
    }

    return undefined;
  }
  async processFile(logs: Log[]): Promise<number | undefined> {
    const maxBlockNumber = _.maxBy<number>(_.map(logs, 'blockNumber'), item =>
      Number(item)
    );
    const sortedLogs = _.orderBy(
      logs,
      ['blockNumber', 'logIndex'],
      ['asc', 'asc']
    );

    await this.onLogsAdded(maxBlockNumber, sortedLogs);

    return maxBlockNumber;
  }
}
