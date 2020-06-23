import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { Address } from '@augurproject/sdk-lite';
import { Block } from 'ethers/providers';
import { AbstractTable } from './AbstractTable';
import { DB } from './DB';

export interface IpfsInfo {
  Name: string;
  Hash: string;
  Size: 0;
}

export interface WarpCheckpointDocument {
  _id: string;
  _rev?: string;
  hash: string;
  market: Address;
  endTimestamp: number;
  end?: Block;
}

export class WarpSyncCheckpointsDB extends AbstractTable {
  constructor(networkId: number, db: DB) {
    super(networkId, 'WarpSyncCheckpoints', db.dexieDB);
  }

  async getMostRecentCheckpoint(): Promise<WarpCheckpointDocument | undefined> {
    return this.table.orderBy('_id').last();
  }

  async getMostRecentWarpSync(): Promise<WarpCheckpointDocument | undefined> {
    return this.table.orderBy('end.number').last();
  }

  async createInitialCheckpoint(initialBlock: Block, market: Market) {
    return this.upsertDocument(initialBlock.number, {
      begin: initialBlock,
      endTimestamp: (await market.getEndTime_()).toNumber(),
      market: market.address,
    });
  }

  async createCheckpoint(end: Block, hash: string) {
    const mostRecentCheckpoint = await this.getMostRecentCheckpoint();

    // These might be served by a dexie transaction.
    await this.upsertDocument(mostRecentCheckpoint._id, {
      end,
      hash,
    });
  }
}
