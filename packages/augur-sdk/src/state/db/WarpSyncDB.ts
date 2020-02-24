import { Block } from 'ethers/providers';
import { AbstractTable } from './AbstractTable';
import { DB } from './DB';
import { IpfsInfo, WarpCheckpointDocument } from './WarpSyncCheckpointsDB';

export interface WarpSyncDocument {
  _id: string;
  _rev?: string;
  begin: Block;
  end: Block;
  hash: string;
}

export class WarpSyncDB extends AbstractTable {

  constructor(networkId: number, db: DB) {
    super(networkId, 'WarpSync', db.dexieDB);
  }

  async createCheckpoint(begin: Block, end: Block,  hash: IpfsInfo) {
    return this.bulkUpsertDocuments([
      {
        begin,
        end,
        hash
      }
    ]);
  }

  async getMostRecentWarpSync():Promise<WarpSyncDocument | undefined> {
    return this.table.orderBy('end.number').last();
  }
}
