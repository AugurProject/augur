import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { MarketsRow, SearchRow, Address } from "../types";
import { contentSearchBuilder} from "../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../utils/format-big-number-as-fixed";

export interface FullTextSearchProvider {
  migrateUp(): Promise<any>;
  migrateDown(): Promise<any>;
  addSearchData(search: SearchRow): Promise<any>;
  removeSeachData(marketId: Address): Promise<any>;
  searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder;
};

export class SqliteSearch implements FullTextSearchProvider {
  db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async migrateUp(): Promise<any> {
    await this.db.schema.dropTableIfExists("search_en");
    await this.db.schema.raw(`CREATE VIRTUAL TABLE search_en USING fts4(marketId, category, tags, shortDescription, longDescription, scalarDenomination, resolutionSource)`);
    const markets: Array<MarketsRow<BigNumber>>  = await this.db.select("*").from("markets");
    for (const market of markets) {
      await this.addSearchData(formatBigNumberAsFixed(market));
    }
  }

  async migrateDown(): Promise<any> {
    return this.db.schema.dropTableIfExists("search_en");
  }


  async addSearchData(search: SearchRow): Promise<any> {
    await this.db("search_en").insert(search).into("search_en");
  }
  
  async removeSeachData(marketId: Address): Promise<any> {
    await this.db("search_en").where({ marketId }).del();
  }

  searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder {
    return builder.select("marketId").from("search_en").whereRaw("search_en MATCH ?", [query]);
  }

};

class PostgreSQLSearch implements FullTextSearchProvider {
  db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async migrateUp(): Promise<any> {
      await this.db.schema.table("markets", (markets) => {
        markets.specificType("searchProperties", "tsvector");
      });
      await this.db("markets").update({
        searchProperties: this.db.raw(`
              setweight(to_tsvector('english', coalesce(category, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag1, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag2, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(shortDescription, '')), 'B') ||
              setweight(to_tsvector('english', coalesce(longDescription, '')), 'B') ||
              setweight(to_tsvector('english', coalesce(scalarDenomination, '')), 'C') ||
              setweight(to_tsvector('english', coalesce(resolutionSource, '')), 'C')
              `)
      });
    await this.db.schema.raw(`CREATE INDEX market_search_idx ON markets USING gin("searchProperties");`);
  }

  async migrateDown(): Promise<any> {
    await this.db.schema.raw(`DROP INDEX market_search_idx IF EXISTS`);
    await this.db.schema.table("markets", (markets) => {
      markets.dropColumn("searchProperties");
    });
  }

  async addSearchData(search: SearchRow): Promise<any> {
    return Promise.resolve();
  }
  
  async removeSeachData(marketId: Address): Promise<any> {
    return Promise.resolve();
  }

  searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder {
    return builder.select("marketId").from("markets").whereRaw(`"searchProperties" @@ to_tsquery(?)`, [query]);
  }
};

export function getFullTextSearchProvider(db: Knex): FullTextSearchProvider|null {
  switch (db.client.config.client) {
    case "sqlite3": return new SqliteSearch(db);;
    case "pg": return new PostgreSQLSearch(db);
    default:
      console.log("Full Text Search not available with this database. In the future we will provide a backup.");
  }
  return null;
}
