import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { MarketsRow, SearchRow, Address } from "../../types";
import { contentSearchBuilder} from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { SearchProvider } from "./provider";

export class SearchPostgres implements SearchProvider {
  public db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  public async migrateUp(): Promise<any> {
      await this.db.schema.table("markets", (markets) => {
        markets.specificType("searchProperties", "tsvector");
      });
      await this.db("markets").update({
        searchProperties: this.db.raw(`
              setweight(to_tsvector('english', coalesce(category, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag1, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(tag2, '')), 'A') ||
              setweight(to_tsvector('english', coalesce("shortDescription", '')), 'B') ||
              setweight(to_tsvector('english', coalesce("longDescription", '')), 'B') ||
              setweight(to_tsvector('english', coalesce("scalarDenomination", '')), 'C') ||
              setweight(to_tsvector('english', coalesce("resolutionSource", '')), 'C')
              `),
      });
      await this.db.schema.raw(`CREATE INDEX market_search_idx ON markets USING gin("searchProperties");`);
  }

  public async migrateDown(): Promise<any> {
    await this.db.schema.raw(`DROP INDEX market_search_idx IF EXISTS`);
    await this.db.schema.table("markets", (markets) => {
      markets.dropColumn("searchProperties");
    });
  }

  public async addSearchData(search: SearchRow): Promise<any> {
    return Promise.resolve();
  }

  public async removeSeachData(marketId: Address): Promise<any> {
    return Promise.resolve();
  }

  public searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder {
    return builder.select("marketId").from("markets").whereRaw(`"searchProperties" @@ to_tsquery(?)`, [query]);
  }
}
