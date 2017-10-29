import { QueryBuilder } from "knex";
import { sortDirection } from "../../utils/sort-direction";

export function queryModifier(query: QueryBuilder, defaultSortBy: string, defaultSortOrder: string, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined): QueryBuilder {
  query = query.orderBy(sortBy || defaultSortBy, sortDirection(isSortDescending, defaultSortOrder));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  return query;
}
