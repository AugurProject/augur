import { AbstractDB, PouchDBFactoryType } from "./AbstractDB";
import Upsert from "pouchdb-upsert";

interface SyncDocument {
  blockNumber: number;
  syncing: boolean;
}

export class SyncStatus extends AbstractDB {
  public readonly defaultStartSyncBlockNumber: number;

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

  public async setHighestSyncBlock(dbName: string, blockNumber: number, syncing: boolean): Promise<PouchDB.UpsertResponse> {
    const document: SyncDocument = { blockNumber, syncing };
    return this.upsertDocument(dbName, document);
  }

  public async getHighestSyncBlock(dbName?: string): Promise<number> {
    const document = await this.getDocument<SyncDocument>(dbName);
    if (document) {
      return document.blockNumber;
    }

    return this.defaultStartSyncBlockNumber;
  }

  public async getLowestSyncingBlockForAllDBs(): Promise<number> {
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

  public async updateSyncingToFalse(dbName: string): Promise<PouchDB.UpsertResponse> {
    const highestBlock = await this.getHighestSyncBlock(dbName);
    return this.setHighestSyncBlock(dbName, highestBlock, false);
  }
}
