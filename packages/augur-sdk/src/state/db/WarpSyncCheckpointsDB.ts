import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { Address } from '@augurproject/sdk-lite';
import { Block } from '@ethersproject/providers';
import { NULL_ADDRESS } from '../getter/types';
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

function serializeBlock(block: Block) {
  return Object.assign({}, block, {
    gasLimit: block.gasLimit.toHexString(),
    gasUsed: block.gasUsed.toHexString(),
  })
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

  async createWarpSyncFileCheckpoint(initialBlock: Block, endBlock: Block, hash: string) {
    return this.upsertDocument(initialBlock.number, {
      begin: serializeBlock(initialBlock),
      // this value isn't important.
      end: serializeBlock(endBlock),
      endTimestamp: endBlock.timestamp,
      market: NULL_ADDRESS,
    });
  }

  async createInitialCheckpoint(initialBlock: Block, market: Market) {
    return this.upsertDocument(initialBlock.number, {
      begin: serializeBlock(initialBlock),
      endTimestamp: (await market.getEndTime_()).toNumber(),
      market: market.address,
    });
  }

  async createCheckpoint(endBlock: Block, hash: string) {
    const mostRecentCheckpoint = await this.getMostRecentCheckpoint();

    // These might be served by a dexie transaction.
    await this.upsertDocument(mostRecentCheckpoint._id, {
      end: serializeBlock(endBlock),
      hash,
    });
  }
}
