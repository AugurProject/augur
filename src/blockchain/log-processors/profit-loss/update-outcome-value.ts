import { Augur } from "augur.js";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback, PayoutNumerators } from "../../../types";
import { numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { getCurrentTime } from "../../process-block";

interface MarketState {
  reportingState: String;
}

interface PriceRow {
  fullPrecisionPrice: BigNumber;
}

interface PayoutAndMarket<BigNumberType> extends PayoutNumerators<BigNumberType> {
  minPrice: BigNumber;
  maxPrice: BigNumber;
  numTicks: BigNumber;
}

export async function updateOutcomeValueFromOrders(db: Knex, marketId: Address, outcome: number, transactionHash: String): Promise<void> {
  const marketState: MarketState = await db
    .first("reportingState")
    .from("market_state")
    .where({ marketId });
  if (marketState.reportingState === "FINALIZED") return;
  const priceRows: Array<PriceRow> = await db
    .select(["fullPrecisionPrice"])
    .from("orders")
    .where({ marketId, orderState: "OPEN", orphaned: false, outcome });
  let value = new BigNumber(0);
  if (priceRows.length > 0) {
    const prices = _.map(priceRows, (priceRow: PriceRow) => {
      return priceRow.fullPrecisionPrice;
    });
    const middle = (prices.length + 1) / 2;
    const sortedPrices = _.sortBy(prices, _.identity);
    value = sortedPrices.length % 2 ? sortedPrices[middle - 1] : sortedPrices[middle - 1.5].plus(sortedPrices[middle - 0.5]).dividedBy(2);
  }

  await db
    .insert({
      marketId,
      transactionHash,
      outcome,
      value: value.toString(),
      timestamp: getCurrentTime(),
    })
    .into("outcome_value_timeseries");
}

export async function updateOutcomeValuesFromFinalization(db: Knex, augur: Augur, marketId: Address, transactionHash: String): Promise<void> {
  const payouts: PayoutAndMarket<BigNumber> = await db
    .first(["payouts.payout0", "payouts.payout1", "payouts.payout2", "payouts.payout3", "payouts.payout4", "payouts.payout5", "payouts.payout6", "payouts.payout7", "markets.minPrice", "markets.maxPrice", "markets.numTicks"])
    .from("payouts")
    .where("payouts.marketId", marketId)
    .join("markets", function() {
      this.on("payouts.marketId", "markets.marketId");
    });
  const timestamp = getCurrentTime();
  const maxPrice = payouts.maxPrice;
  const minPrice = payouts.minPrice;
  const numTicks = payouts.numTicks;
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  const insertValues = [];
  for (let i: number = 0; i <= 7; i++) {
    const column = `payout${i}`;
    const payoutValue = payouts[column as keyof PayoutAndMarket<BigNumber>];
    if (payoutValue != null) {
      const value = payoutValue.times(tickSize).plus(minPrice);
      insertValues.push({
        marketId,
        transactionHash,
        outcome: i,
        value: value.toString(),
        timestamp,
      });
    }
  }
  await db.insert(insertValues).into("outcome_value_timeseries");
}

export async function removeOutcomeValue(db: Knex, transactionHash: String): Promise<void> {
  await db("outcome_value_timeseries")
    .delete()
    .where({ transactionHash });
}
