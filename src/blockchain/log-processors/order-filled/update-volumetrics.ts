import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, TradesRow, ReportingState} from "../../../types";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";
import { WEI_PER_ETHER } from "../../../constants";
import { updateCategoryAggregationsOnMarketOpenInterestChanged } from "../category-aggregations";

async function incrementMarketVolume(db: Knex, marketId: Address, amount: BigNumber, price: BigNumber): Promise<BigNumber> {
  const result: { volume: BigNumber; shareVolume: BigNumber } = await db("markets").first("volume", "shareVolume").where({ marketId });
  const incrementedShareVolume = amount.plus(result.shareVolume);
  const volume = result.volume;
  const newVolume = amount.multipliedBy(price);
  const incremented = newVolume.plus(volume);
  await db("markets").update({ volume: incremented.toString(), shareVolume: incrementedShareVolume.toString() }).where({ marketId });
  return incremented;
}

async function incrementOutcomeVolume(db: Knex, marketId: Address, outcome: number, amount: BigNumber, price: BigNumber): Promise<BigNumber> {
  const result: { volume: BigNumber; shareVolume: BigNumber } = await db("outcomes").first("volume", "shareVolume").where({ marketId, outcome });
  const incrementedShareVolume = amount.plus(result.shareVolume);
  const volume = result.volume;
  const newVolume = amount.multipliedBy(price);
  const incremented = newVolume.plus(volume);
  await db("outcomes").update({ volume: incremented.toString(), shareVolume: incrementedShareVolume.toString() }).where({ marketId, outcome });
  return incremented;
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

  const newOpenInterestInETH = new BigNumber(newOpenInterestInETHString, 10);
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
  const sharesOutstanding = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(shareTokenRow.supply, 10), tickSize).toString();
  await db("markets").where({ marketId }).update({ sharesOutstanding });
  const tradesRow: TradesRow<BigNumber>|undefined = await db.first("numCreatorShares", "numCreatorTokens", "price", "orderType", "amount").from("trades")
    .where({ marketId, outcome, orderId, blockNumber });
  if (!tradesRow) throw new Error(`trade not found, orderId: ${orderId}`);
  let amount = tradesRow.amount!;
  if (!isIncrease) amount = amount.negated();
  const price = tradesRow.price!.minus(minPrice);
  await incrementMarketVolume(db, marketId, amount, price);
  await incrementOutcomeVolume(db, marketId, outcome, amount, price);
  await setMarketLastTrade(db, marketId, blockNumber);
  await updateMarketOpenInterest(db, marketId);
}
