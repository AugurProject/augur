import { Address, Augur, BigNumber, PayoutNumerators } from "../../../types";
import Knex from "knex";

import { numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { getCurrentTime } from "../../process-block";

interface MarketState {
  reportingState: string;
}

interface PriceRow {
  fullPrecisionPrice: BigNumber;
}

interface PayoutAndMarket<BigNumberType> extends PayoutNumerators<BigNumberType> {
  minPrice: BigNumber;
  maxPrice: BigNumber;
  numTicks: BigNumber;
}

export async function updateOutcomeValueFromOrders(db: Knex, marketId: Address, outcome: number, transactionHash: string, value: BigNumber): Promise<void> {
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

interface FinalizationValue {
  marketId: Address;
  transactionHash: string;
  outcome: number;
  value: string;
  timestamp: number;
}

export async function updateOutcomeValuesFromFinalization(db: Knex, augur: Augur, marketId: Address, transactionHash: string): Promise<void> {
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
  const insertValues:Array<FinalizationValue> = [];
  for (let i: number = 0; i <= 7; i++) {
    const column = `payout${i}`;
    const payoutValue = payouts[column as keyof PayoutAndMarket<BigNumber>];
    if (payoutValue != null) {
      const value = payoutValue.multipliedBy(tickSize).plus(minPrice);
      insertValues.push(<FinalizationValue>{
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

export async function removeOutcomeValue(db: Knex, transactionHash: string): Promise<void> {
  await db("outcome_value_timeseries")
    .delete()
    .where({ transactionHash });
}
