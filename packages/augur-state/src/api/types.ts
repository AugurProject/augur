export interface SortLimit {
  sortBy?: string;
  isSortDescending?: boolean;
  limit?: number;
  offset?: number;
}

export enum MarketType {
  YesNo = 0,
  Categorical = 1,
  Scalar = 2
}
