import * as PouchDB from "pouchdb";
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
  public readonly dbName: string;

  constructor (dbName: string) {
    this.dbName = dbName;
    this.db = new PouchDB(`db/${dbName}`);
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

  protected async upsertDocument(id: string, document: object): Promise<PouchDB.Core.Response> {
    const previousBlockRev = await this.getPouchRevFromId(id);
    return this.db.put(Object.assign(
      previousBlockRev ? { _rev: previousBlockRev } : {},
      { _id: id },
      document,
    ));
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
    })
    try {
      const results = await this.db.bulkDocs(mergedRevisionDocuments);
      return _.every(results, (response) => (<PouchDB.Core.Response>response).ok )
    } catch (err) {
      console.error(`ERROR in bulk sync: ${JSON.stringify(err)}`);
      return false;
    }
  }
}
