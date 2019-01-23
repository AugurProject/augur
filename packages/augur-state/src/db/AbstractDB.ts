import * as PouchDB from "pouchdb";

export abstract class AbstractDB {
  private db: PouchDB.Database;

  protected constructor (dbName: string) {
    this.db = new PouchDB(dbName);
  }

  private async getPouchRevFromId(id: string): Promise<string|undefined> {
    try {
      const previousBlockRev = await this.db.get(id);
      return previousBlockRev._rev;
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

  protected async bulkUpsertDocuments(startkey: string, documents: Array<object>): Promise<void> {
    const previousDocumentEntries = await this.db.allDocs({ startkey, include_docs: true });
    const previousDocs = previousDocumentEntries.rows.map((row) => row.doc);
    // Need to go through provided documents and specify a revision number if present in previousDocs
  }
}
