import * as Knex from "knex";
import { SearchRow, Address } from "../../types";

export interface SearchProvider  {
  migrateUp(): Promise<any>;
  migrateDown(): Promise<any>;
  addSearchData(search: SearchRow): Promise<any>;
  removeSeachData(marketId: Address): Promise<any>;
  searchBuilder(builder: Knex.QueryBuilder, query: string): Knex.QueryBuilder;
}
