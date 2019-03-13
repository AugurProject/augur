import fs from "fs";
import PouchDB from "pouchdb";
PouchDB.plugin(require('pouchdb-adapter-memory'));
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-upsert'));
import * as _ from "lodash";

interface DocumentIDToRev {
  [docId:string]: string;
}

export interface BaseDocument {
  _id: string;
  _rev?: string;
}

export abstract class AbstractDB {
  protected db: PouchDB.Database;
  protected networkId: number;
  public readonly dbName: string;

  protected constructor (networkId: number, dbName: string, dbFactory: PouchDBFactoryType) {
    this.networkId = networkId;
    this.dbName = dbName;
    this.db = dbFactory(dbName);
  }

  private async getPouchRevFromId(id: string): Promise<string|undefined> {
    const document = await this.getDocument<BaseDocument>(id);
    if (document) return document._rev;
    return undefined;
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

  // protected async upsertDocument(id: string, document: object): Promise<PouchDB.Core.Response> {
  //   const previousBlockRev = await this.getPouchRevFromId(id);
  //   let result;
  //   try {
  //     result = await this.db.put(Object.assign(
  //       previousBlockRev ? { _rev: previousBlockRev } : {},
  //       { _id: id },
  //       document,
  //     ));
  //   } catch (err) {
  //     this.upsertDocument(id, document);
  //   }

  //   return result;
  // }

  protected async upsertDocument(id: string, document: object): Promise<PouchDB.Core.Response> {
    const previousBlockRev = await this.getPouchRevFromId(id);
    let result = await this.db.upsert(
      id,
      function(doc) {
        return Object.assign(
          previousBlockRev ? { _rev: previousBlockRev } : {},
            { _id: id },
            document,
          );
      }
    );
    let newResult;
    return {
      id: result.id,
      rev: result.rev,
      ok: true,
    };
    // Object.assign(
    // previousBlockRev ? { _rev: previousBlockRev } : {},
    //   { _id: id },
    //   document,
    // ));
  }

  protected async bulkUpsertDocuments(startkey: string, documents: Array<PouchDB.Core.PutDocument<{}>>): Promise<boolean> {
    const previousDocumentEntries = await this.db.allDocs({ startkey, include_docs: true });
    const previousDocs = _.reduce(previousDocumentEntries.rows, (result, prevDoc) => {
      result[prevDoc.id] = prevDoc.doc!._rev;
      return result;
    }, {} as DocumentIDToRev);
    const mergedRevisionDocuments = _.map(documents, (doc) => {
      const previousRev = previousDocs[doc._id!];
      return Object.assign(
        previousRev ? { _rev: previousRev } : {},
        doc,
      );
    });
    try {
      const results = await this.db.bulkDocs(mergedRevisionDocuments);
      return _.every(results, (response) => (<PouchDB.Core.Response>response).ok );
    } catch (err) {
      console.error(`ERROR in bulk sync: ${JSON.stringify(err)}`);
      return false;
    }
  }

  public async getInfo(): Promise<PouchDB.Core.DatabaseInfo> {
    return await this.db.info();
  }

  public async find(request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return await this.db.find(request);
  }

  public async allDocs(): Promise<PouchDB.Core.AllDocsResponse<{}>> {
    return await this.db.allDocs({ include_docs: true });
  }
}

export type PouchDBFactoryType = (dbName: string) => PouchDB.Database;
export function PouchDBFactory(dbArgs : object) {
  const dbDir = "db";
  if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir);
  }
  return (dbName: string) => new PouchDB(`${dbDir}/${dbName}`, dbArgs);
}
