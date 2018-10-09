import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { MarketsRow, SearchRow, Address } from "../../types";
import { contentSearchBuilder} from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { SearchProvider } from "./provider";

export class SearchSqlite implements SearchProvider {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  public async migrateUp(): Promise<any> {
    await this.db.schema.dropTableIfExists("search_en");
    await this.db.schema.raw(`CREATE VIRTUAL TABLE search_en USING fts4(marketId, category, tags, shortDescription, longDescription, scalarDenomination, resolutionSource)`);
    const markets: Array<MarketsRow<BigNumber>>  = await this.db.select("*").from("markets");
    for (const market of markets) {
        await this.addSearchData(contentSearchBuilder(formatBigNumberAsFixed(market)));
      }
  }

  public async migrateDown(): Promise<any> {
    return this.db.schema.dropTableIfExists("search_en");
  }

  public async addSearchData(search: SearchRow): Promise<any> {
    await this.db("search_en").insert(search).into("search_en");
  }

  public async removeSeachData(marketId: Address): Promise<any> {
    await this.db("search_en").where({ marketId }).del();
  }

  public searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder {
    return builder.select("marketId").from("search_en").whereRaw("search_en MATCH ?", [query]);
  }
}
