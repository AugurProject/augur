import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { MarketsRow, SearchRow, Address } from "../../types";
import { contentSearchBuilder} from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export interface SearchProvider  {
  migrateUp(): Promise<any>;
  migrateDown(): Promise<any>;
  addSearchData(search: SearchRow): Promise<any>;
  removeSeachData(marketId: Address): Promise<any>;
  searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder;
}
