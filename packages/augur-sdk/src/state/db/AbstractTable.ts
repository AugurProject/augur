import { Dexie } from "dexie";
import * as _ from 'lodash';

export interface BaseDocument {
  id: string;
}

export abstract class AbstractTable {
  table: Dexie.Table<any, any>;
  protected networkId: number;
  readonly dbName: string;
  public numIndexes: number = 0;

  protected constructor(networkId: number, dbName: string, db: Dexie) {
    this.networkId = networkId;
    this.dbName = dbName;
    this.table = db[dbName];
  }

  async clearDB(): Promise<void> {
    await this.table.clear();
  }

  async allDocs(): Promise<any[]> {
    return this.table.toArray()
  }

  async getDocumentCount(): Promise<number> {
    return this.table.count();
  }

  protected async getDocument<Document>(id: string): Promise<Document | undefined> {
    return this.table.get(id);
  }

  protected async bulkUpsertDocuments(documents: Array<BaseDocument>): Promise<void> {
    for (let document of documents) {
      await this.table.update(document.id, document);
    }
  }

  async find(request: {}): Promise<Dexie.Collection<any, any>> {
    return this.table.where(request);
  }
}
