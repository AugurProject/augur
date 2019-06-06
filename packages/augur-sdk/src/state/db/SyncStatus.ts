import { AbstractDB, PouchDBFactoryType } from "./AbstractDB";

interface SyncDocument {
  blockNumber: number;
}

export class SyncStatus extends AbstractDB {
  public readonly defaultStartSyncBlockNumber: number;

  constructor(networkId: number, defaultStartSyncBlockNumber: number, dbFactory: PouchDBFactoryType) {
    super(networkId, networkId + "-SyncStatus", dbFactory);
    this.defaultStartSyncBlockNumber = defaultStartSyncBlockNumber;

    this.db.createIndex({
      index: {
        fields: ["blockNumber"],
      },
    });
  }

  public async setHighestSyncBlock(dbName: string, blockNumber: number): Promise<PouchDB.Core.Response> {
    const document: SyncDocument = { blockNumber };
    return this.upsertDocument(dbName, document);
  }

  public async getHighestSyncBlock(dbName?: string): Promise<number> {
    if (dbName) {
      const document = await this.getDocument<SyncDocument>(dbName);
      if (document) return document.blockNumber;
      return this.defaultStartSyncBlockNumber;
    } else {
      const highestBlock = await this.find({
        selector: {
          blockNumber: { $gt: 0 },
        },
        fields: ["blockNumber"],
        sort: ["blockNumber"],
      });

      console.log(highestBlock.docs);

      return (highestBlock.docs[0] as any).blockNumber;
    }
  }
}
