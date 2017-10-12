import * as Knex from "knex";
import { ErrorCallback } from "../types";

export function checkAugurDbSetup(db: Knex, callback: ErrorCallback): void {
  db.migrate.currentVersion().then((version: any): void => {
    if (version === null) {
      callback(new Error("Database not setup, run knex `migrate:latest && knex seed:run` before continuing"));
    } else {
      callback(null);
    }
  })
  .catch(callback);
}
