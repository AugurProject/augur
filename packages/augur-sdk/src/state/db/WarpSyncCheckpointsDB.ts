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

export interface WarpCheckpointBlock {
  hash: string;
  parentHash: string;
  number: number;
  timestamp: number;
  nonce: string;
  difficulty: number;
  gasLimit: string;
  gasUsed: string;
  miner: string;
  extraData: string;
  transactions: Array<string>;
}

export interface WarpCheckpointDocument {
  _id: string;
  _rev?: string;
  hash: string;
  market: Address;
  endTimestamp: number;
  end?: WarpCheckpointBlock;
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
    const beginBlock = Object.assign({}, initialBlock, {
      gasLimit: initialBlock.gasLimit.toHexString(),
      gasUsed: initialBlock.gasUsed.toHexString(),
    })
    return this.upsertDocument(initialBlock.number, {
      begin: beginBlock,
      endTimestamp: (await market.getEndTime_()).toNumber(),
      market: market.address,
    });
  }

  async createCheckpoint(end: Block, hash: string) {
    const mostRecentCheckpoint = await this.getMostRecentCheckpoint();
    const endBlock = Object.assign({}, end, {
      gasLimit: end.gasLimit.toHexString(),
      gasUsed: end.gasUsed.toHexString(),
    })

    // These might be served by a dexie transaction.
    await this.upsertDocument(mostRecentCheckpoint._id, {
      end: endBlock,
      hash,
    });
  }
}
