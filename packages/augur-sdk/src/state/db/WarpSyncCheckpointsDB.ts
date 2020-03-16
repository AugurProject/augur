import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { Block } from 'ethers/providers';
import { Address } from '../logs/types';
import { AbstractTable } from './AbstractTable';
import { DB } from './DB';

export interface IpfsInfo {
  Name: string,
  Hash: string,
  Size: 0,
}

export interface WarpCheckpointDocument {
  _id: string;
  _rev?: string;
  begin: Block;
  ipfsInfo?: IpfsInfo;
  market: Address;
  endTimestamp: number;
  end?: Block
}

export class WarpSyncCheckpointsDB extends AbstractTable {
  constructor(networkId: number, db: DB) {
    super(networkId, 'WarpSyncCheckpoints', db.dexieDB);
  }

  async getAllIPFSObjects() {
    const rows = await this.allDocs();
    return rows.filter((item) => item.ipfsInfo).map((item) => item.ipfsInfo)
  }

  async getMostRecentCheckpoint(): Promise<WarpCheckpointDocument | undefined> {
    return this.table.orderBy('_id').last();
  }

  // This method assumes pre-existing checkpoints.
  async getCheckpointBlockRange(): Promise<[Block, Block]> {
    const firstCheckpoint = await this.table.orderBy('_id').first();
    const lastCheckpoint = await this.table.orderBy('_id').filter((item) => typeof item.end !== 'undefined').last();
    return [
        firstCheckpoint.begin,
        lastCheckpoint?.end,
    ];
  }

  async getAllCheckpoints(): Promise<WarpCheckpointDocument[]> {
    return this.table.toArray() as unknown as Promise<WarpCheckpointDocument[]>;
  }

  async createInitialCheckpoint(initialBlock: Block, market: Market) {
    return this.upsertDocument(initialBlock.number, {
      begin: initialBlock,
      endTimestamp: (await market.getEndTime_()).toNumber(),
      market: market.address,
    });
  }

  async createCheckpoint(end: Block, ipfsInfo: IpfsInfo) {
    const mostRecentCheckpoint  = await this.getMostRecentCheckpoint();
    // These might be served by a dexie transaction.
    await this.upsertDocument(mostRecentCheckpoint._id, {
      end,
      ipfsInfo
    });
  }
}
