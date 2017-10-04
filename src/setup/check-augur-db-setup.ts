import { Database } from "sqlite3";
import { ErrorCallback } from "../types";
import { createAugurDbTables } from "./create-augur-db-tables";
import { insertTestDataIntoAugurDb } from "./insert-test-data-into-augur-db";

export function checkAugurDbSetup(db: Database, callback: ErrorCallback): void {
  db.raw(`SELECT count(*) AS is_already_setup FROM sqlite_master WHERE type='table' AND name='blockchain_sync_history'`, (err?: Error|null, row?: {is_already_setup: number}) => {
    if (err) return callback(err);
    if (row!.is_already_setup === 1) return callback(null);
    createAugurDbTables(db, (err?: Error|null) => insertTestDataIntoAugurDb(db, callback));
  });
}
