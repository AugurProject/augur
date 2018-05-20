import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { sortDirection } from "../../utils/sort-direction";
import { safeBigNumberCompare } from "../../utils/safe-big-number-compare";
import { GenericCallback } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { isFieldBigNumber } from "../post-process-database-results";
import {
  Address,
  MarketsRowWithTime,
  OutcomesRow,
  UIMarketInfo,
  UIOutcomeInfo,
  UIStakeInfo,
  DisputeTokensRowWithTokenState,
  UIDisputeTokenInfo,
  Payout,
  PayoutRow,
  NormalizedPayout,
  NormalizedPayoutNumerators,
  StakeDetails,
  TradingHistoryRow,
} from "../../types";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";

export interface Dictionary {
  [key: string]: any;
}

export function queryModifierDB(
  query: Knex.QueryBuilder,
  defaultSortBy: string,
  defaultSortOrder: string,
  sortBy: string | null | undefined,
  isSortDescending: boolean | null | undefined,
  limit: number | null | undefined,
  offset: number | null | undefined,
): Knex.QueryBuilder {
  query = query.orderBy(sortBy || defaultSortBy, sortDirection(isSortDescending, defaultSortOrder));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  return query;
}

function queryModifierUserland<T>(
  db: Knex,
  query: Knex.QueryBuilder,
  defaultSortBy: string,
  defaultSortOrder: string,
  sortBy: string | null | undefined,
  isSortDescending: boolean | null | undefined,
  limit: number | null | undefined,
  offset: number | null | undefined,
  callback: GenericCallback<Array<T>>,
): void {
  type RowWithSort = T & {xMySorterFieldx: BigNumber};

  let sortField: string = defaultSortBy;
  let sortDescending: boolean = defaultSortOrder.toLowerCase() === "desc";

  if (sortBy != null) {
    sortField = sortBy;
    if (typeof(isSortDescending) !== "undefined" && isSortDescending !== null) {
      sortDescending = isSortDescending;
    }
  }

  query.select(db.raw(`?? as "xMySorterFieldx"`, [sortField])).asCallback((error: Error|null, rows: Array<RowWithSort>) => {
    if (error) return callback(error);
    try {
      const ascendingSorter = (left: RowWithSort, right: RowWithSort) => safeBigNumberCompare(left.xMySorterFieldx, right.xMySorterFieldx);
      const descendingSorter  = (left: RowWithSort, right: RowWithSort) => safeBigNumberCompare(right.xMySorterFieldx, left.xMySorterFieldx);
      const results = rows.sort(sortDescending ? descendingSorter : ascendingSorter);
      if (limit == null && offset == null)
        return callback(null, results);
      return callback(null, results.slice(offset || 0, limit || results.length));
    } catch (e) {
      callback(e);
    }
  });
}

export function queryModifier<T>(
  db: Knex,
  query: Knex.QueryBuilder,
  defaultSortBy: string,
  defaultSortOrder: string,
  sortBy: string | null | undefined,
  isSortDescending: boolean | null | undefined,
  limit: number | null | undefined,
  offset: number | null | undefined,
  callback: GenericCallback<Array<T>>,
): void {
  const sortFieldName = (sortBy || defaultSortBy || "").split(".").pop();
  if (sortFieldName !== "" && isFieldBigNumber(sortFieldName!)) {
    queryModifierUserland(db, query, defaultSortBy, defaultSortOrder, sortBy, isSortDescending, limit, offset, callback);
  } else {
    queryModifierDB(query, defaultSortBy, defaultSortOrder, sortBy, isSortDescending, limit, offset).asCallback(callback);
  }
}

export function reshapeOutcomesRowToUIOutcomeInfo(outcomesRow: OutcomesRow<BigNumber>): UIOutcomeInfo<BigNumber> {
  return {
    id: outcomesRow.outcome,
    volume: outcomesRow.volume,
    price: outcomesRow.price,
    description: outcomesRow.description,
  };
}

export function reshapeMarketsRowToUIMarketInfo(row: MarketsRowWithTime, outcomesInfo: Array<UIOutcomeInfo<BigNumber>>, winningPayoutRow: PayoutRow<BigNumber> | null): UIMarketInfo<string> {
  let consensus: NormalizedPayout<string> | null = null;
  if (winningPayoutRow != null) {
    consensus = normalizedPayoutsToFixed(normalizePayouts(winningPayoutRow));
  }
  return Object.assign(
    formatBigNumberAsFixed<UIMarketInfo<BigNumber>, UIMarketInfo<string>>({
      id: row.marketId,
      universe: row.universe,
      marketType: row.marketType,
      numOutcomes: row.numOutcomes,
      minPrice: row.minPrice,
      maxPrice: row.maxPrice,
      cumulativeScale: row.maxPrice.minus(row.minPrice),
      author: row.marketCreator,
      consensus: null,
      creationTime: row.creationTime,
      creationBlock: row.creationBlockNumber,
      creationFee: row.creationFee,
      settlementFee: row.reportingFeeRate.plus(row.marketCreatorFeeRate),
      reportingFeeRate: row.reportingFeeRate,
      marketCreatorFeeRate: row.marketCreatorFeeRate,
      marketCreatorFeesBalance: row.marketCreatorFeesBalance!,
      marketCreatorMailbox: row.marketCreatorMailbox,
      marketCreatorMailboxOwner: row.marketCreatorMailboxOwner,
      initialReportSize: row.initialReportSize,
      category: row.category,
      tags: [row.tag1, row.tag2],
      volume: row.volume,
      outstandingShares: row.sharesOutstanding,
      feeWindow: row.feeWindow,
      endTime: row.endTime,
      finalizationBlockNumber: row.finalizationBlockNumber,
      finalizationTime: row.finalizationTime,
      reportingState: row.reportingState,
      forking: row.forking,
      needsMigration: row.needsMigration,
      description: row.shortDescription,
      details: row.longDescription,
      scalarDenomination: row.scalarDenomination,
      designatedReporter: row.designatedReporter,
      designatedReportStake: row.designatedReportStake!,
      resolutionSource: row.resolutionSource,
      numTicks: row.numTicks,
      outcomes: _.map(outcomesInfo, (outcomeInfo) => formatBigNumberAsFixed<UIOutcomeInfo<BigNumber>, UIOutcomeInfo<string>>(outcomeInfo)),
      tickSize: numTicksToTickSize(row.numTicks, row.minPrice, row.maxPrice),
    }),
    {
      consensus,
    },
  );
}

export function reshapeDisputeTokensRowToUIDisputeTokenInfo(disputeTokenRow: DisputeTokensRowWithTokenState<BigNumber>): UIDisputeTokenInfo<BigNumber> {
  return Object.assign(_.omit(disputeTokenRow, ["payoutId", "winning"]) as DisputeTokensRowWithTokenState<BigNumber>, {
    isInvalid: !!disputeTokenRow.isInvalid,
    claimed: !!disputeTokenRow.claimed,
    winningToken: disputeTokenRow.winning == null ? null : !!disputeTokenRow.winning,
  });
}

export function getMarketsWithReportingState(db: Knex, selectColumns?: Array<string>): Knex.QueryBuilder {
  // TODO: turn leftJoin() into join() once we take care of market_state on market creation
  const columns = selectColumns ? selectColumns.slice() : ["markets.*", "market_state.reportingState as reportingState", "blocks.timestamp as creationTime"];
  return db
    .select(columns)
    .from("markets")
    .leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId")
    .leftJoin("blocks", "markets.creationBlockNumber", "blocks.blockNumber");
}

export function normalizePayouts(payoutRow: Payout<BigNumber>): NormalizedPayout<BigNumber> {
  const payout = [];
  for (let i = 0; i < 8; i++) {
    const payoutNumerator = payoutRow[("payout" + i) as keyof Payout<BigNumber>] as BigNumber | null;
    if (payoutNumerator == null) break;
    payout.push(payoutNumerator);
  }
  return Object.assign({}, { payout } as NormalizedPayoutNumerators<BigNumber>, { isInvalid: !!payoutRow.isInvalid });
}

export function normalizedPayoutsToFixed(payout: NormalizedPayout<BigNumber>): NormalizedPayout<string> {
  return {
    isInvalid: payout.isInvalid,
    payout: payout.payout.map((payout: BigNumber) => payout.toFixed()),
  };
}

export function uiStakeInfoToFixed(stakeInfo: UIStakeInfo<BigNumber>): UIStakeInfo<string> {
  const info = formatBigNumberAsFixed<UIStakeInfo<BigNumber>, UIStakeInfo<string>>(stakeInfo);
  info.stakes = stakeInfo.stakes.map((stake) => {
    const details = formatBigNumberAsFixed<StakeDetails<BigNumber>, StakeDetails<string>>(stake);
    const payouts = normalizedPayoutsToFixed(stake);
    return Object.assign({}, details, payouts);
  });

  return info;
}

export function queryTradingHistory(
  db: Knex | Knex.Transaction,
  universe: Address | null,
  account: Address | null,
  marketId: Address | null,
  outcome: number | null,
  orderType: string | null,
  earliestCreationTime: number | null,
  latestCreationTime: number | null,
  sortBy: string | null,
  isSortDescending: boolean | null,
  limit: number | null,
  offset: number | null,
  callback: GenericCallback<Array<TradingHistoryRow>>,
): void {
  if (universe == null && marketId == null) throw new Error("Must provide reference to universe, specify universe or marketId");
  const query = db
    .select([
      "trades.transactionHash",
      "trades.logIndex",
      "trades.marketId",
      "trades.outcome",
      "trades.orderType",
      "trades.price",
      "trades.amount",
      "trades.creator",
      "trades.shareToken",
      "trades.blockNumber",
      "trades.marketCreatorFees",
      "trades.reporterFees",
      "trades.tradeGroupId",
      "blocks.timestamp",
    ])
    .from("trades");
  query.leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber");
  query.leftJoin("markets", "trades.marketId", "markets.marketId");

  if (account != null) query.where((builder) => builder.where("trades.creator", account).orWhere("trades.filler", account));
  if (universe != null) query.where("universe", universe);
  if (marketId != null) query.where("trades.marketId", marketId);
  if (outcome != null) query.where("trades.outcome", outcome);
  if (orderType != null) query.where("trades.orderType", orderType);
  if (earliestCreationTime != null) query.where("timestamp", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("timestamp", "<=", latestCreationTime);

  queryModifier(db, query, "trades.blockNumber", "desc", sortBy, isSortDescending, limit, offset, callback);
}

export function groupByAndSum<T extends Dictionary>(rows: Array<T>, groupFields: Array<string>, sumFields: Array<string>): Array<T> {
  return _.chain(rows)
    .groupBy((row) => _.values(_.pick(row, groupFields)))
    .values()
    .map((groupedRows: Array<T>): T => {
      return _.reduce(groupedRows, (result: T | undefined, row: T): T => {
        if (typeof result === "undefined") return row;

        const mapped = _.map(row, (value: BigNumber | number | null, key: string): Array<any> => {
          const previousValue = result[key];
          if (sumFields.indexOf(key) === -1 || typeof previousValue === "undefined" || value === null || typeof value === "undefined") {
            return [key, value];
          } else if (BigNumber.isBigNumber(value)) {
            return [key, (value as BigNumber).plus(result[key] as BigNumber)];
          } else {
            return [key, value + previousValue];
          }
        }) as Array<any>;

        return _.fromPairs(mapped) as T;
      }) as T;
    })
    .value();
}

// TODO: This return type is not correct, an empty rows array returns undefined, but the '!' implies it does not
export function sumBy<T extends Dictionary, K extends keyof T>(rows: Array<T>, ...sumFields: Array<K>): Pick<T, K> {
  return _.chain(rows)
    .map((row) => _.pick(row, sumFields))
    .reduce((result: Pick<T, K>, row: Pick<T, K>): Pick<T, K> => {
      if (typeof result === "undefined") return row;

      const mapped = _.map(row, (value: T[K], key: K): Array<any> => {
        const previousValue = result[key];
        if (sumFields.indexOf(key) === -1 || typeof previousValue === "undefined" || value === null || typeof value === "undefined") {
          return [key, value];
        } else if (BigNumber.isBigNumber(value)) {
          return [key, (value as BigNumber).plus(result[key] as BigNumber)];
        } else if (typeof value === "number") {
          return [key, value + previousValue];
        }

        return [key, value];
      }) as Array<any>;

      return _.fromPairs(mapped) as Pick<T, K>;
    })
    .value()!;
}
