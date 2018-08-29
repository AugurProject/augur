import * as Knex from "knex";
import { MarketsRow } from "../types";
import { contentSearchBuilder} from "../../utils/content-search-builder";

export class FullTextSearchProvider {
  static async migrateUp(): Promise<any>;
  static async migrateDown(): Promise<any>;
};

export class SqliteSearch extends FullTextSearchProvider {
  static async migrateUp(db: Knex): Promise<any> {
    await db.schema.dropTableIfExists("search_en");
    await db.schema.raw(`CREATE VIRTUAL TABLE search_en USING fts4(marketId, category, tags, shortDescription, longDescription, scalarDenomination, resolutionSource)`);
    const markets: Array<MarketsRow>  = await db.select("*").from("markets");
    for (const market of markets) {
      await this.constructor.addMarket(contentSearchBuilder(market));
    }
  }

  static async migrateDown(db: Knex): Promise<any> {
    return db.schema.dropTableIfExists(search_en);
  }


  static async addMarket(market: MarketsRow<string|number>): Promise<any> {
    const marketSearchDataToInsert: SearchRow = contentSearchBuilder(marketsDataToInsert);

    await db("search_en").insert(market).into("search_en");
  }
  
  static async removeMarket(marketId: Address): Promise<any> {
    await db("search_en").where({ marketId }).del();
  }
  
  static searchBuilder(builder: Knex.QueryBuilder, query: String): Knex.QueryBuilder {
    return builder.select("marketId").from("search_en").whereRaw("search_en MATCH ?", [query]);
  }

};

class PostgreSQLSearch extends FullTextSearchProvider {
  static async migrateUp(db: Knex): Promise<any> {
      await db.schema.table("markets", (markets) => {
        markets.specificType("searchProperties", "tsvector");
      });
      await db("markets").update({
        searchProperties: db.raw(`
              setweight(to_tsvector('english', coalesce(category, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag1, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag2, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(shortDescription, '')), 'B') ||
              setweight(to_tsvector('english', coalesce(longDescription, '')), 'B') ||
              setweight(to_tsvector('english', coalesce(scalarDenomination, '')), 'C') ||
              setweight(to_tsvector('english', coalesce(resolutionSource, '')), 'C')
              `);
      });
    await db.schema.raw(`CREATE INDEX market_search_idx ON markets USING gin("searchProperties");`);
  }

  static async migrateDown(db: Knex): Promise<any> {
    await db.schema.raw(`DROP INDEX market_search_idx IF EXISTS`);
    await db.schema.table("markets", (markets) => {
      markets.dropColumn("searchProperties");
    });
  }

  static async addMarket(market: MarketsRow): Promise<any> {
    return Promse.resolve();
  }
  
  static async removeMarket(marketId: Address): Promise<any> {
    return Promse.resolve();
  }

  static searchBuilder(builder: Knex.QueryBuilder, query: String): Knex.QueryBuilder {
    return builder.select("marketId").from("markets").whereRaw(`"searchProperties" @@ to_tsquery(?)`, [query]);
  }
};

export getFullTextSearchProvider(db: Knex): FullTextSearchProvider {
  switch (db.config.client) {
    case sqlite3: return SqliteSearch;
    case pg: return PostgreSQLSearch;
    default:
      console.log("Full Text Search not available with this database. In the future we will provide a backup.");
  }
  return null;
}
