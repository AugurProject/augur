import { Dexie } from "dexie";
import * as _ from 'lodash';

export type PrimitiveID = string | number | Date;

export type ID = PrimitiveID | Array<PrimitiveID>;

export interface BaseDocument {
  [key: string]: any;
}

export abstract class AbstractTable {
  table: Dexie.Table<any, any>;
  protected networkId: number;
  readonly dbName: string;
  protected idFields: string[];

  protected constructor(networkId: number, dbName: string, db: Dexie) {
    this.networkId = networkId;
    this.dbName = dbName;
    this.table = db[dbName];
    const keyPath = this.table.schema.primKey.keyPath;
    this.idFields = typeof keyPath === 'string' ? [keyPath] : keyPath;
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
      const documentID = this.getIDValue(document);
      await this.upsertDocument(documentID, document);
    }
  }

  protected async upsertDocument(documentID: ID, document: BaseDocument): Promise<void> {
    delete document.constructor;
    const result = await this.table.update(documentID, document);
    if (result === 0) {
      await this.table.put(document);
    }
  }

  async find(request: {}): Promise<Dexie.Collection<any, any>> {
    return this.table.where(request);
  }

  protected getIDValue(document: any): ID {
    if (this.idFields.length == 1) return document[this.idFields[0]];

    const id = [];
    for (let idField of this.idFields) {
      id.push(document[idField]);
    }
    return id;
  }

}
