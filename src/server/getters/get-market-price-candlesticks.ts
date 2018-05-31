import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address } from "../../types";
import { ZERO } from "../../constants";

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

export function getMarketPriceCandlesticks(db: Knex, marketId: Address, outcome: number|undefined, start: number|undefined, end: number|undefined, period: number|undefined, callback: (err: Error|null, result?: UICandlesticks) => void): void {
  if (marketId == null) return callback(new Error("Must provide marketId"));
  const query = db.select([
    "trades.outcome",
    "trades.price",
    "trades.amount",
    "blocks.timestamp",
  ]).from("trades").join("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketId });
  if (start != null) query.where("blocks.timestamp", ">=", start);
  if (end != null) query.where("blocks.timestamp", "<=", end);
  if (outcome) query.where({ outcome });
  query.asCallback((err: Error|null, tradesRows?: Array<MarketPriceHistoryRow>): void => {
    if (err) return callback(err);
    if (!tradesRows) return callback(new Error("Internal error retrieving market price history"));
    const tradeRowsByOutcome = _.groupBy(tradesRows, "outcome");
    callback(null,
      _.mapValues(tradeRowsByOutcome, (outcomeTradeRows) => {
        const outcomeTradeRowsByPeriod = _.groupBy(outcomeTradeRows, (tradeRow) => getPeriodStarttime(start || 0, tradeRow.timestamp, period || 60));
        return _.map(outcomeTradeRowsByPeriod, (trades: Array<MarketPriceHistoryRow>, startTimestamp): Candlestick => {
          return {
            startTimestamp: parseInt(startTimestamp, 10),
            start: _.minBy(trades, "timestamp")!.price.toFixed(),
            end: _.maxBy(trades, "timestamp")!.price.toFixed(),
            min: _.minBy(trades, "price")!.price.toFixed(),
            max: _.maxBy(trades, "price")!.price.toFixed(),
            volume: _.reduce(trades, (totalAmount: BigNumber, tradeRow: MarketPriceHistoryRow) =>  totalAmount.plus(tradeRow.amount), ZERO)!.toFixed(),
          };
        });
      }),
    );
  });
}
