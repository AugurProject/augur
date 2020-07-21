import { EthersProvider } from '@augurproject/ethersjs-provider';
import { NullWarpSyncHash, SECONDS_IN_A_DAY } from '@augurproject/sdk-lite';
import { Log } from '@augurproject/types';
import { logger } from '@augurproject/utils';
import { Block } from 'ethers/providers';
import _ from 'lodash';
import { WarpController } from '../../warp/WarpController';
import { DB } from '../db/DB';

const BULKSYNC_HORIZON = SECONDS_IN_A_DAY.multipliedBy(7).toNumber();

export class WarpSyncStrategy {
  constructor(
    protected warpSyncController: WarpController,
    protected onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>,
    protected db: DB,
    protected provider: EthersProvider
  ) {}

  async pinHashByGatewayUrl(url: string) {
    return this.warpSyncController.pinHashByGatewayUrl(url);
  }

  async start(
    currentBlock: Block,
    ipfsRootHash?: string,
  ): Promise<number | undefined> {
    await this.warpSyncController.createInitialCheckpoint();

    // This is the warp hash for the value '0' which means there isn't yet a finalized hash.
    if (
      ipfsRootHash &&
      ipfsRootHash !== NullWarpSyncHash
    ) {
      return this.loadCheckpoints(ipfsRootHash, currentBlock);
    } else {
      // No hash, nothing more to do!
      return undefined;
    }
  }

  async loadCheckpoints(
    ipfsRootHash: string,
    currentBlock?: Block
  ): Promise<number | undefined> {
    const mostRecentWarpSync = await this.warpSyncController.getMostRecentWarpSync();
    if (
      !mostRecentWarpSync ||
      currentBlock.timestamp - mostRecentWarpSync.end.timestamp >
      BULKSYNC_HORIZON && mostRecentWarpSync.hash !== ipfsRootHash
    ) {
      let logs;
      let endBlockNumber;

      try {
        const checkpoint = await this.warpSyncController.getCheckpointFile(ipfsRootHash);
        logs = checkpoint.logs;
        endBlockNumber = checkpoint.endBlockNumber;
      } catch(e) {
        logger.error(`Couldn't get checkpoint file: ${e}`);
        return undefined;
      }

      // Blow it all away and refresh.
      logger.debug("Applying Warp Sync File");
      await this.warpSyncController.destroyAndRecreateDB();
      await this.warpSyncController.createInitialCheckpoint();

      const maxBlock = await this.processFile(logs);

      // Update the WarpSync checkpoint db.
      await this.db.warpCheckpoints.createCheckpoint(
        await this.provider.getBlock(endBlockNumber),
        ipfsRootHash
      );

      return maxBlock;
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
