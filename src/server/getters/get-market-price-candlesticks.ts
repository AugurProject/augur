import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../constants";
import { OutcomeParam } from "../../types";

export const MarketPriceCandlesticksParams = t.type({
  marketId: t.string,
  outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
  start: t.union([t.number, t.null, t.undefined]),
  end: t.union([t.number, t.null, t.undefined]),
  period: t.union([t.number, t.null, t.undefined]),
});

// export function getMarketPriceCandlesticks(db: Knex, marketId: Address, outcome: number|undefined, start: number|undefined, end: number|undefined, period: number|undefined, callback: (err: Error|null, result?: UICandlesticks) => void): void {

interface MarketPriceHistoryRow {
  timestamp: number;
  outcome: number;
  price: BigNumber;
  amount: BigNumber;
}

export interface Candlestick {
  startTimestamp: number;
  start: string;
  end: string;
  min: string;
  max: string;
  volume: string;
}

export interface UICandlesticks {
  [outcome: number]: Array<Candlestick>;
}

function getPeriodStarttime(globalStarttime: number, periodStartime: number, period: number) {
  const secondsSinceGlobalStart = (periodStartime - globalStarttime);
  return (secondsSinceGlobalStart - secondsSinceGlobalStart % period) + globalStarttime;
}

export async function getMarketPriceCandlesticks(db: Knex, augur: {}, params: t.TypeOf<typeof MarketPriceCandlesticksParams>): Promise<UICandlesticks> {
  const query = db.select([
    "trades.outcome",
    "trades.price",
    "trades.amount",
    "blocks.timestamp",
  ]).from("trades").join("blocks", "trades.blockNumber", "blocks.blockNumber").where("marketId", params.marketId);
  if (params.start != null) query.where("blocks.timestamp", ">=", params.start);
  if (params.end != null) query.where("blocks.timestamp", "<=", params.end);
  if (params.outcome) query.where("outcome", params.outcome);
  const tradesRows: Array<MarketPriceHistoryRow> = await query;
  const tradeRowsByOutcome = _.groupBy(tradesRows, "outcome");
  return _.mapValues(tradeRowsByOutcome, (outcomeTradeRows) => {
    const outcomeTradeRowsByPeriod = _.groupBy(outcomeTradeRows, (tradeRow) => getPeriodStarttime(params.start || 0, tradeRow.timestamp, params.period || 60));
    return _.map(outcomeTradeRowsByPeriod, (trades: Array<MarketPriceHistoryRow>, startTimestamp): Candlestick => {
      return {
        startTimestamp: parseInt(startTimestamp, 10),
        start: _.minBy(trades, "timestamp")!.price.toString(),
        end: _.maxBy(trades, "timestamp")!.price.toString(),
        min: _.minBy(trades, "price")!.price.toString(),
        max: _.maxBy(trades, "price")!.price.toString(),
        volume: _.reduce(trades, (totalAmount: BigNumber, tradeRow: MarketPriceHistoryRow) => totalAmount.plus(tradeRow.amount), ZERO)!.toString(),
      };
    });
  });
}
