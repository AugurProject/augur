import * as PouchDB from "pouchdb";

export class DBController {
  private db: PouchDB.Database;

  public constructor () {}

  public static async createAndInitializeDB(dbName: string): Promise<DBController> {
    const dbController = new DBController();
    dbController.initializeDB(dbName);
    return dbController;
  }

  public async initializeDB(dbName: string): Promise<void> {
    this.db = new PouchDB(dbName);
  }
}
