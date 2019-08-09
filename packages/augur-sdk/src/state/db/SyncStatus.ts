import { AbstractDB, PouchDBFactoryType } from "./AbstractDB";
import Upsert from "pouchdb-upsert";

interface SyncDocument {
  _id?: string;
  _rev?: string;
  blockNumber: number;
  syncing: boolean;
}

export class SyncStatus extends AbstractDB {
  readonly defaultStartSyncBlockNumber: number;

  constructor(networkId: number, defaultStartSyncBlockNumber: number, dbFactory: PouchDBFactoryType) {
    super(networkId, networkId + "-SyncStatus", dbFactory);
    this.defaultStartSyncBlockNumber = defaultStartSyncBlockNumber;

    this.db.createIndex({
      index: {
        fields: ["syncing"],
      },
    });

    this.db.createIndex({
      index: {
        fields: ["blockNumber"],
      },
    });
  }

  async setHighestSyncBlock(databaseDocumentId: string, blockNumber: number, syncing: boolean, rollback = false): Promise<PouchDB.UpsertResponse> {
    return this.db.upsert(databaseDocumentId, (document: SyncDocument) => {
      // make sure the truly highest block is always being used
      document.blockNumber = rollback ? blockNumber : Math.max(blockNumber, document.blockNumber || this.defaultStartSyncBlockNumber);
      document.syncing = syncing;

      // db.upsert sets _rev and _id so we don't have to
      return document;
    });
  }

  async getHighestSyncBlock(dbName: string): Promise<number> {
    const document = await this.getDocument<SyncDocument>(dbName);
    return document ? document.blockNumber : this.defaultStartSyncBlockNumber;
  }

  async getLowestSyncingBlockForAllDBs(): Promise<number> {
    const lowestBlock = await this.find({
      selector: {
        syncing: true,
        blockNumber: { $gt: 0 },
      },
      sort: [{ blockNumber: 'asc' }],
      fields: ["blockNumber", "syncing", "_id"],
    });

    if (lowestBlock.docs && lowestBlock.docs.length > 0) {
      return (lowestBlock.docs[0] as any).blockNumber;
    } else {
      return -1;
    }
  }

  async updateSyncingToFalse(dbName: string): Promise<PouchDB.UpsertResponse> {
    const highestBlock = await this.getHighestSyncBlock(dbName);
    return this.setHighestSyncBlock(dbName, highestBlock, false);
  }
}
