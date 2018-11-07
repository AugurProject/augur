import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, TradesRow} from "../../../types";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";
import { WEI_PER_ETHER } from "../../../constants";

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

function incrementCategoryPopularity(db: Knex, category: string, amount: BigNumber) {
  return db.raw(`UPDATE categories SET popularity = popularity + :amount WHERE category = :category`, { amount: amount.toString(), category });
}

function setMarketLastTrade(db: Knex, marketId: Address, blockNumber: number) {
  return db("markets").update("lastTradeBlockNumber", blockNumber).where({ marketId });
}

export async function updateOpenInterest(db: Knex, marketId: Address) {
  const marketRow: { numTicks: BigNumber }|undefined = await db.first("numTicks").from("markets").where({ marketId });
  if (marketRow == null) throw new Error(`No marketId for openInterest: ${marketId}`);
  const numTicks = marketRow.numTicks;
  const shareTokenRow: { supply: BigNumber }|undefined = await db.first("supply").from("token_supply").join("tokens", "token_supply.token", "tokens.contractAddress").where({
    marketId,
    symbol: "shares",
  });
  if (shareTokenRow == null) throw new Error(`No shareToken supply found for market: ${marketId}`);
  const openInterest = shareTokenRow.supply.multipliedBy(numTicks);
  await db("markets").update({ openInterest: convertFixedPointToDecimal(openInterest, WEI_PER_ETHER) }).where({ marketId });
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
  await incrementCategoryPopularity(db, category, amount);
  await updateOpenInterest(db, marketId);
}
