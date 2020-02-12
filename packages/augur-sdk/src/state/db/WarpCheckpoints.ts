import { Block } from 'ethers/providers';
import { AbstractTable } from './AbstractTable';
import { DB } from './DB';

interface IpfsInfo {
  Name: string,
  Hash: string,
  Size: 0,
}

export interface WarpCheckpointDocument {
  _id: string;
  _rev?: string;
  begin: Block;
  ipfsInfo?: IpfsInfo;
  end?: Block
}

export class WarpCheckpoints extends AbstractTable {
  constructor(networkId: number, db: DB) {
    super(networkId, 'WarpCheckpoints', db.dexieDB);
  }

  async getAllIPFSObjects() {
    const rows = await this.table.toArray();
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
        lastCheckpoint.end,
    ];
  }

  async createInitialCheckpoint(initialBlock: Block) {
    return this.table.add({
      begin: initialBlock
    });
  }

  async createCheckpoint(end: Block, begin: Block,  ipfsInfo: IpfsInfo) {
    const mostRecentCheckpoint  = await this.getMostRecentCheckpoint();
    // These might be served by a dexie transaction.
    await this.upsertDocument(mostRecentCheckpoint._id, {
      end,
      ipfsInfo
    });

    await this.createInitialCheckpoint(begin);
  }
}
