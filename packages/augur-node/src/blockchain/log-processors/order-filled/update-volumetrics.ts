import { Address, Augur, BigNumber, Bytes32, ReportingState, TradesRow } from "../../../types";

import Knex from "knex";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";
import { WEI_PER_ETHER } from "../../../constants";
import { updateCategoryAggregationsOnMarketOpenInterestChanged } from "../category-aggregations";
import { convertOnChainAmountToDisplayAmount } from "../../../utils";

// volumeForTrade owns the business definition for the incremental financial
// volume produced by one Augur transaction. Traditional finance uses `volume`
// to describe number of shares changing hands; Augur is different: our
// db.{markets,outcomes}.volume is amount of currency/tokens changing hands (not
// number of shares). volumeForTrade is exported only for unit test purposes.
export function volumeForTrade(numTicks: BigNumber, p: {
  numCreatorTokens: BigNumber;
  numCreatorShares: BigNumber;
  numFillerTokens: BigNumber;
  numFillerShares: BigNumber;
}): BigNumber {
  // Our buiness definition for volume is "currency/token changing hands". We include "escrowed" as one of the "hands":
  // numCreatorTokens is currency being escrowed to create complete sets, or currency going to the counterparty. Either way this contributes to volume.
  return p.numCreatorTokens.plus(
    // numFillerTokens follows same reasoning as numCreatorTokens.
    p.numFillerTokens).plus(
      // When complete sets are destroyed, currency is unlocked from escrow and sent to the parties' wallets. To be destroyed, a complete set must be, in fact, "complete". If Bob provides 12 YES shares, and Jim provides 5 NO shares, we can only make 5 complete sets; Bob's 7 YES shares are excess, and cannot be matched with NO shares to become a complete set for destruction. (Bob's 7 YES shares become Jim's property.) That's why we use min() to determine the number of complete sets destroyed. We multiply by numTicks because (numOfCompleteSets*numTicks) is the currency/token (Ether) amount released from escrow when those complete sets are destroyed.
      p.numCreatorShares.minus(p.numFillerShares).multipliedBy(numTicks)
    );
}

async function incrementMarketVolume(db: Knex, marketId: Address, amount: BigNumber, tradesRow: TradesRow<BigNumber>, isIncrease: boolean): Promise<void> {
  const marketsRow: { numTicks: BigNumber, volume: BigNumber; shareVolume: BigNumber }|undefined = await db("markets").first("numTicks", "volume", "shareVolume").where({ marketId });
  if (marketsRow === undefined) throw new Error(`No marketId for incrementMarketVolume: ${marketId}`);
  const newShareVolume = amount.plus(marketsRow.shareVolume);
  let vft = volumeForTrade(marketsRow.numTicks, tradesRow);
  if (!isIncrease) vft = vft.multipliedBy(new BigNumber(-1));
  const newVolume = marketsRow.volume.plus(vft);
  await db("markets").update({ volume: newVolume.toString(), shareVolume: newShareVolume.toString() }).where({ marketId });
}

async function incrementOutcomeVolume(db: Knex, marketId: Address, outcome: number, amount: BigNumber, tradesRow: TradesRow<BigNumber>, isIncrease: boolean): Promise<void> {
  const marketsRow: { numTicks: BigNumber }|undefined = await db("markets").first("numTicks").where({ marketId });
  if (marketsRow === undefined) throw new Error(`No marketId for incrementOutcomeVolume: ${marketId}`);
  const outcomesRow: { volume: BigNumber; shareVolume: BigNumber }|undefined = await db("outcomes").first("volume", "shareVolume").where({ marketId, outcome });
  if (outcomesRow === undefined) throw new Error(`No outcome for incrementOutcomeVolume: marketId=${marketId} outcome=${outcome}`);
  const newShareVolume = amount.plus(outcomesRow.shareVolume);
  let vft = volumeForTrade(marketsRow.numTicks, tradesRow);
  if (!isIncrease) vft = vft.multipliedBy(new BigNumber(-1));;
  const newVolume = outcomesRow.volume.plus(vft);
  await db("outcomes").update({ volume: newVolume.toString(), shareVolume: newShareVolume.toString() }).where({ marketId, outcome });
}

function setMarketLastTrade(db: Knex, marketId: Address, blockNumber: number) {
  return db("markets").update("lastTradeBlockNumber", blockNumber).where({ marketId });
}

export async function updateMarketOpenInterest(db: Knex, marketId: Address) {
  const marketRow: {
    category: string,
    numTicks: BigNumber,
    openInterest: BigNumber,
    reportingState: ReportingState,
  }|undefined = await db.first([
    "markets.category as category",
    "markets.numTicks as numTicks",
    "markets.openInterest as openInterest",
    "market_state.reportingState as reportingState",
  ]).from("markets")
    .leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId")
    .where({ "markets.marketId": marketId });
  if (marketRow == null) throw new Error(`No marketId for openInterest: ${marketId}`);

  const shareTokenRow: { supply: BigNumber }|undefined = await db.first("supply").from("token_supply").join("tokens", "token_supply.token", "tokens.contractAddress").where({
    marketId,
    symbol: "shares",
  });
  if (shareTokenRow == null) throw new Error(`No shareToken supply found for market: ${marketId}`);

  const newOpenInterestInETHString: string = convertFixedPointToDecimal(shareTokenRow.supply.multipliedBy(marketRow.numTicks), WEI_PER_ETHER);
  await db("markets").update({ openInterest: newOpenInterestInETHString }).where({ marketId });

  const newOpenInterestInETH = new BigNumber(newOpenInterestInETHString);
  await updateCategoryAggregationsOnMarketOpenInterestChanged({
    db,
    categoryName: marketRow.category,
    reportingState: marketRow.reportingState,
    newOpenInterest: newOpenInterestInETH,
    oldOpenInterest: marketRow.openInterest,
  });
}

export async function updateVolumetrics(db: Knex, augur: Augur, category: string, marketId: Address, outcome: number, blockNumber: number, orderId: Bytes32, orderCreator: Address, tickSize: BigNumber, minPrice: BigNumber, maxPrice: BigNumber, isIncrease: boolean) {
  const shareTokenRow: { supply: BigNumber } = await db.first("token_supply.supply").from("tokens").join("token_supply", "token_supply.token", "tokens.contractAddress").where({ outcome, marketId });
  if (shareTokenRow == null) throw new Error(`No shareToken found for market: ${marketId} outcome: ${outcome}`);
  const sharesOutstanding = convertOnChainAmountToDisplayAmount(new BigNumber(shareTokenRow.supply), tickSize).toString();
  await db("markets").where({ marketId }).update({ sharesOutstanding });
  const tradesRow: TradesRow<BigNumber>|undefined = await db.first("numCreatorShares", "numCreatorTokens", "numFillerTokens", "numFillerShares", "amount").from("trades")
    .where({ marketId, outcome, orderId, blockNumber });
  if (!tradesRow) throw new Error(`trade not found, orderId: ${orderId}`);
  let amount = tradesRow.amount!;
  if (!isIncrease) amount = amount.multipliedBy(new BigNumber(-1));
  await incrementMarketVolume(db, marketId, amount, tradesRow, isIncrease);
  await incrementOutcomeVolume(db, marketId, outcome, amount, tradesRow, isIncrease);
  await setMarketLastTrade(db, marketId, blockNumber);
  await updateMarketOpenInterest(db, marketId);
}
