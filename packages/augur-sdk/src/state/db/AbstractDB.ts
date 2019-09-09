import fs from 'fs';
import Find from 'pouchdb-find';
import Memory from 'pouchdb-adapter-memory';
import PouchDB from 'pouchdb';
import Upsert from 'pouchdb-upsert';
import pouchdbDebug from 'pouchdb-debug';

import * as _ from 'lodash';
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

PouchDB.plugin(Find);
PouchDB.plugin(Memory);
PouchDB.plugin(Upsert);
PouchDB.plugin(pouchdbDebug);

interface DocumentIDToDoc {
  [docId: string]: PouchDB.Core.ExistingDocument<{}>;
}

export interface BaseDocument {
  _id: string;
  _rev?: string;
}

export abstract class AbstractDB {
  db: PouchDB.Database;
  protected networkId: number;
  readonly dbName: string;

  protected constructor(networkId: number, dbName: string, dbFactory: PouchDBFactoryType) {
    this.networkId = networkId;
    this.dbName = dbName;
    this.db = dbFactory(dbName);
  }

  async allDocs(): Promise<PouchDB.Core.AllDocsResponse<{}>> {
    return this.db.allDocs({ include_docs: true });
  }

  protected async getDocument<Document>(id: string): Promise<Document | undefined> {
    try {
      return await this.db.get<Document>(id);
    } catch (err) {
      if (err.status === 404) {
        return undefined;
      }
      throw err;
    }
  }

  protected async upsertDocument(id: string, document: object): Promise<PouchDB.UpsertResponse> {
    // db.upsert sets _rev and _id so we don't have to
    return this.db.upsert(id, () => {
      return document;
    });
  }

  protected async bulkUpsertUnorderedDocuments(documents: Array<PouchDB.Core.PutDocument<{}>>): Promise<boolean> {
    const previousDocumentEntries = await this.db.find({ selector: { _id: { $in: documents.map(doc => doc._id) } } });
    const previousDocs = _.reduce(previousDocumentEntries.docs, (result, prevDoc) => {
      result[prevDoc._id] = prevDoc;
      return result;
    }, {} as DocumentIDToDoc);
    return this.bulkUpsertDocuments(previousDocs, documents);
  }

  protected async bulkUpsertOrderedDocuments(startkey: string, documents: Array<PouchDB.Core.PutDocument<{}>>): Promise<boolean> {
    const previousDocumentEntries = await this.db.allDocs({ startkey, include_docs: true });
    const previousDocs = _.reduce(previousDocumentEntries.rows, (result, prevDoc) => {
      result[prevDoc.id] = prevDoc.doc;
      return result;
    }, {} as DocumentIDToDoc);
    return this.bulkUpsertDocuments(previousDocs, documents);
  }

  private async bulkUpsertDocuments(previousDocs: DocumentIDToDoc, documents: Array<PouchDB.Core.PutDocument<{}>>): Promise<boolean> {
    const mergedRevisionDocuments = _.map(documents, (doc) => {
      // The c'tor needs to be deleted since indexeddb bulkUpsert cannot accept objects with methods on them
      delete doc.constructor;

      const previousDoc = previousDocs[doc._id!];
      return Object.assign(
        previousDoc ? previousDoc : {},
        doc
      );
    });
    try {
      const results = await this.db.bulkDocs(mergedRevisionDocuments);
      return _.every(results, (response) => (response as PouchDB.Core.Response).ok);
    } catch (err) {
      console.error(`ERROR in bulk upsert: ${JSON.stringify(err)}`);
      return false;
    }
  }

  async getInfo(): Promise<PouchDB.Core.DatabaseInfo> {
    return this.db.info();
  }

  async find(request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.db.find(request);
  }

  protected async getPouchRevFromId(id: string): Promise<string | undefined> {
    const document = await this.getDocument<BaseDocument>(id);
    if (document) return document._rev;
    return undefined;
  }
}

export type PouchDBFactoryType = (dbName: string) => PouchDB.Database;

export function PouchDBFactory(dbArgs: DatabaseConfiguration) {
  const dbDir = 'db';

  if (fs && fs.existsSync && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }

  return (dbName: string) => new PouchDB(`${dbDir}/${dbName}`, dbArgs);
}
