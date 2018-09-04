import * as Knex from "knex";
import { SearchProvider } from "./provider";
import { SearchSqlite } from "./sqlite";
import { SearchPostgres } from "./postgres";

export { SearchProvider } from "./provider";
export function createSearchProvider(db: Knex): SearchProvider|null {
  switch (db.client.config.client) {
    case "sqlite3": return new SearchSqlite(db);
    case "pg": return new SearchPostgres(db);
    default:
      console.log("Full Text Search not available with this database. In the future we will provide a backup.");
  }
  return null;
}
