import { promisify } from "util";
import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { Augur } from "augur.js";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { getProceedTradeRows } from "./get-proceed-trade-rows";
import {
  Address,
  BlocksRow,
  Payout,
  MarketPricing,
  NormalizedPayout,
  TradingHistoryRow,
  ProceedTradesRow,
  GenericCallback,
} from "../../types";

import {
  queryTradingHistory as queryTradingHistoryCallback,
  normalizePayouts,
} from "./database";

const queryTradingHistory = promisify(queryTradingHistoryCallback);

const DEFAULT_NUMBER_OF_BUCKETS = 30;
// Make the math tolerable until we have a chance to fix the BN->Stringness in augur.js
function add(n1: string, n2: string) {
  return new BigNumber(n1, 10).plus(new BigNumber(n2));
}

function sub(n1: string, n2: string) {
  return new BigNumber(n1, 10).minus(new BigNumber(n2));
}

export type ProfitLoss = Record<"position" | "meanOpenPrice" | "realized" | "unrealized" | "total", string>;
export interface PLBucket {
  timestamp: number;
  lastPrice?: string;
  profitLoss?: ProfitLoss | null;
}

export type TradeRow = TradingHistoryRow & { type: string; maker: boolean } | ProceedTradesRow<BigNumber>;
export type PayoutBlockAndPricing= Payout<BigNumber> & BlocksRow & MarketPricing<BigNumber>;

export interface ProfitLossResults {
  aggregate: Array<PLBucket>;
  all: any;
}

export function calculateBucketProfitLoss(augur: Augur, trades: Array<TradeRow>, buckets: Array<PLBucket>): Array<PLBucket> {
  if (buckets == null) throw new Error("Buckets are required");
  if (typeof buckets.map === "undefined") throw new Error(`buckets must be an array, got ${buckets}`);

  const [basisPL, ...windowPLs] = buckets.map((bucket: PLBucket) => {
    if (bucket.lastPrice == null) return bucket;

    const bucketTrades = _.filter(trades, (t: TradeRow) => t.timestamp < bucket.timestamp);
    const profitLoss = augur.trading.calculateProfitLoss({ trades: bucketTrades, lastPrice: bucket.lastPrice });
    return Object.assign({}, bucket, { profitLoss });
  });

  if (basisPL.profitLoss != null && windowPLs.length > 0) {
    return windowPLs.map((pl) => {
      if (pl.profitLoss == null) return pl;
      const profitLoss = Object.assign({}, pl.profitLoss, {
        realized: sub(pl.profitLoss.realized, basisPL.profitLoss!.realized).toFixed(),
        total: sub(pl.profitLoss.total, basisPL.profitLoss!.total).toFixed(),
        unrealized: sub(pl.profitLoss.unrealized, basisPL.profitLoss!.unrealized).toFixed(),
      });
      return Object.assign({}, pl, { profitLoss });
    });
  }

  return windowPLs;
}

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<PLBucket> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime < startTime) throw new Error("endTime must be greater than or equal startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  const buckets: Array<PLBucket> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push({ timestamp: bucketEndTime, profitLoss: null });
  }
  buckets.push({ timestamp: endTime, profitLoss: null });

  return buckets;
}

function queryWinningPayoutForMarket(db: Knex, marketId: Address): Knex.QueryBuilder {
  return db("markets")
    .first(["payouts.*", "blocks.*", "markets.minPrice", "markets.maxPrice", "markets.numTicks"])
    .join("blocks", "blocks.blockNumber", "markets.finalizationBlockNumber")
    .join("payouts", function() {
      this.on("payouts.marketId", "markets.marketId").andOn("payouts.winning", db.raw("1"));
    })
    .where("markets.marketId", marketId);
}

async function getFinalizedOutcomePrice(db: Knex, marketId: Address, outcome: number) {
  const payout: PayoutBlockAndPricing | null | undefined  = await queryWinningPayoutForMarket(db, marketId);
  if (payout == null)  return null;

  const marketPayout: NormalizedPayout<BigNumber> = normalizePayouts(payout);

  // this is the same as augur.utils.convertOnChainPriceToDisplayPrice
  // I hate having to get it off an `augur` instance when its unrelated
  // to a connection
  const tickSize = numTicksToTickSize(payout.numTicks, payout.minPrice, payout.maxPrice);
  const price = marketPayout.payout[outcome]!.times(tickSize).plus(payout.minPrice);
  return { timestamp: payout.timestamp, price };
}

async function getBucketLastTradePrices(db: Knex, universe: Address, marketId: Address, outcome: number, endTime: number, buckets: Array<PLBucket>): Promise<Array<PLBucket>> {
  const outcomeTrades: Array<Partial<TradingHistoryRow>> = await queryTradingHistory(db, universe, null, marketId, outcome, null, null, endTime, "trades.blockNumber", false, null, null);
  const outcomeFinalized = await getFinalizedOutcomePrice(db, marketId, outcome);

  return buckets.map((bucket: PLBucket) => {
    // This market has been finalized and this bucket is after the time which
    // that happened. We will fix the price for this outcome at the value
    // defined in the `payouts` table. This will effectively adjust the unrealized
    // profit and loss for the shares held for this outcome for this bucket.
    if (outcomeFinalized !== null && outcomeFinalized.timestamp < bucket.timestamp) {
      return Object.assign({}, bucket, { lastPrice: outcomeFinalized.price.toFixed() });
    }

    // This insertion point will give us the place in the sorted "outcomeTrades" array
    // where out bucket can go without changing the sort order, which means that one entry
    // before that location is the "last trade" in that window.
    const insertPoint: number = _.sortedIndexBy(outcomeTrades, { timestamp: bucket.timestamp }, (trade) => trade.timestamp);
    if (insertPoint > 0) {
      return Object.assign({}, bucket, { lastPrice: outcomeTrades[insertPoint - 1].price!.toFixed() });
    }

    // If the insertPoint is zero and we get here, then we don't have any
    // "lastPrice" value -- e.g. there are no trades in that point which will
    // result in a `null` PL.
    return bucket;
  });
}

function groupOutcomesProfitLossByBucket(results: any) {
  return _.zip(..._.values(results));
}

function sumProfitLossResults(left: PLBucket, right: PLBucket): PLBucket {
  if (left == null) return right;
  if (left.profitLoss == null) return right;
  if (right.profitLoss == null) return left;

  const leftAveragePrice = new BigNumber(left.profitLoss.meanOpenPrice, 10);
  const leftPosition = new BigNumber(left.profitLoss.position, 10);

  const rightAveragePrice = new BigNumber(right.profitLoss.meanOpenPrice, 10);
  const rightPosition = new BigNumber(right.profitLoss.position, 10);

  const position = leftPosition.plus(rightPosition);
  const meanOpenPrice = leftAveragePrice
    .times(leftPosition)
    .plus(rightAveragePrice.times(rightPosition))
    .dividedBy(position);
  const realized = add(left.profitLoss.realized, right.profitLoss.realized);
  const unrealized = add(left.profitLoss.unrealized, right.profitLoss.unrealized);
  const total = realized.plus(unrealized);

  return {
    timestamp: left.timestamp,
    profitLoss: formatBigNumberAsFixed({
      meanOpenPrice,
      position,
      realized,
      unrealized,
      total,
    }),
  };
}

async function getPL(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number | null): Promise<ProfitLossResults> {
  // get all the trades for this user from the beginning of time, until
  // `endTime`
  const tradeHistory: Array<TradingHistoryRow> = await queryTradingHistory(db, universe, account, null, null, null, null, endTime, "trades.blockNumber", false, null, null);
  const marketIds = _.uniq(_.map(tradeHistory, "marketId"));
  const claimHistory: Array<ProceedTradesRow<BigNumber>> = await getProceedTradeRows(db, augur, marketIds, account, endTime);
  const trades: Array<TradeRow> = tradeHistory.map((trade: TradingHistoryRow): TradeRow => {
    return Object.assign({}, trade, {
      type: trade.orderType! === "buy" ? "sell" : "buy",
      maker: account === trade.creator!,
    });
  }).concat(claimHistory).sort((a, b) => {
    const blockDiff = a.blockNumber - b.blockNumber;
    if (blockDiff !== 0) return blockDiff;

    return a.logIndex - b.logIndex;
  });

  if (trades.length === 0) return { aggregate: bucketRangeByInterval(startTime, endTime, periodInterval).slice(1), all: {} };

  const buckets = bucketRangeByInterval(startTime || trades[0].timestamp, endTime, periodInterval);

  // group these trades by their market & outcome, so we can process each
  // separately
  const tradesByOutcome = _.groupBy(trades, (trade) => _.values(_.pick(trade, ["marketId", "outcome"])));

  // For each group, gather the last trade prices for each bucket, and
  // calculate each bucket's profit and loss
  interface GroupResults {
    marketId: string;
    outcome: number;
    profitLoss: Array<PLBucket>;
  }
  const results = await Promise.all(
    _.map(tradesByOutcome, async (trades: Array<TradeRow>): Promise<GroupResults> => {
      const { marketId, outcome } = trades[0];
      const bucketsWithLastPrice: Array<PLBucket> = await getBucketLastTradePrices(db, universe, marketId, outcome, endTime, buckets);
      return {marketId, outcome, profitLoss: calculateBucketProfitLoss(augur, trades, bucketsWithLastPrice)};
    }),
  );

  // We have results! Drop the market & outcome groups, and then re-group by
  // bucket timestamp, and aggregate all of the PLBuckets by bucket
  const aggregate = groupOutcomesProfitLossByBucket(results.map((r) => r.profitLoss)).map((bucket: Array<PLBucket>) => {
    return bucket.reduce(sumProfitLossResults, { timestamp: 0, profitLoss: null });
  });

  const all = _
    .chain(results)
    .groupBy((result) => result.marketId)
    .mapValues((results: Array<GroupResults>) => {
      const byOutcome = _
        .chain(results)
        .groupBy((result) => result.outcome)
        .mapValues((results: Array<GroupResults>) => results.map((result) => result.profitLoss))
        .value();

      const array = [];
      for (let i = 0; i < 8; i++) {
        array.push(byOutcome[i.toString()] || null);
      }

      return _.dropRightWhile(_.flatten(array), (v) => v === null);
    })
    .value();

  return { aggregate, all};
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address|undefined, account: Address|undefined, startTime: number, endTime: number, periodInterval: number|null, callback: GenericCallback<ProfitLossResults>) {
  if (typeof universe !== "string") return callback(new Error("Universe Address Required"));
  if (typeof account !== "string") return callback(new Error("Account Address Required"));
  try {
    getPL(db, augur, universe.toLowerCase(), account.toLowerCase(), startTime, endTime, periodInterval)
      .then((results: ProfitLossResults) => callback(null, results));
  } catch (e) {
    callback(e);
  }
}
