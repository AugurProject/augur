import { AbstractTable } from "./AbstractTable";
import { DB } from './DB';

interface SyncDocument {
  _id?: string;
  _rev?: string;
  blockNumber: number;
  syncing: boolean;
}

export class SyncStatus extends AbstractTable {
  readonly defaultStartSyncBlockNumber: number;

  constructor(networkId: number, defaultStartSyncBlockNumber: number, db: DB) {
    super(networkId, "SyncStatus", db.dexieDB);
    this.defaultStartSyncBlockNumber = defaultStartSyncBlockNumber;
  }

  async setHighestSyncBlock(eventName: string, blockNumber: number, syncing: boolean): Promise<void> {
    await this.table.put({
      eventName,
      syncing,
      blockNumber,
    });
  }

  async getHighestSyncBlock(dbName: string): Promise<number> {
    const document = await this.getDocument<SyncDocument>(dbName);
    return document ? document.blockNumber : this.defaultStartSyncBlockNumber;
  }

  async getLowestSyncingBlockForAllDBs(): Promise<number> {
    const results = await this.table.where("syncing").equals(1);
    const sorted = await results.sortBy("blockNumber");

    if (sorted.length > 0) {
      return (sorted[0] as any).blockNumber;
    } else {
      return -1;
    }
  }

  async updateSyncingToFalse(dbName: string): Promise<void> {
    const highestBlock = await this.getHighestSyncBlock(dbName);
    return this.setHighestSyncBlock(dbName, highestBlock, false);
  }
}
