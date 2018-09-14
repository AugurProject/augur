import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { series } from "async";
import { Address, Bytes32, TradesRow, ErrorCallback, GenericCallback } from "../../../types";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";
import { WEI_PER_ETHER } from "../../../constants";

function incrementMarketVolume(db: Knex, marketId: Address, amount: BigNumber, price: BigNumber, callback: GenericCallback<BigNumber>) {
  db("markets").first("volume", "shareVolume").where({ marketId }).asCallback((err: Error|null, result: { volume: BigNumber; shareVolume: BigNumber }) => {
    if (err) return callback(err);
    const incrementedShareVolume = amount.plus(result.shareVolume);
    const volume = result.volume;
    const newVolume = amount.multipliedBy(price);
    const incremented = newVolume.plus(volume);
    db("markets").update({ volume: incremented.toString(), shareVolume: incrementedShareVolume.toString() }).where({ marketId }).asCallback((err: Error|null, affectedRowsCount: number) => {
      if (err) return callback(err);
      if (affectedRowsCount === 0) return process.nextTick(() => incrementMarketVolume(db, marketId, amount, price, callback));
      callback(null, incremented);
    });
  });
}

function incrementOutcomeVolume(db: Knex, marketId: Address, outcome: number, amount: BigNumber, price: BigNumber, callback: GenericCallback<BigNumber>) {
  db("outcomes").first("volume", "shareVolume").where({ marketId, outcome }).asCallback((err: Error|null, result: { volume: BigNumber; shareVolume: BigNumber}) => {
    if (err) return callback(err);
    const incrementedShareVolume = amount.plus(result.shareVolume);
    const volume = result.volume;
    const newVolume = amount.multipliedBy(price);
    const incremented = newVolume.plus(volume);
    db("outcomes").update({ volume: incremented.toString(), shareVolume: incrementedShareVolume.toString() }).where({ marketId, outcome }).asCallback((err: Error|null, affectedRowsCount: number) => {
      if (err) return callback(err);
      if (affectedRowsCount === 0) return process.nextTick(() => incrementOutcomeVolume(db, marketId, outcome, amount, price, callback));
      callback(null, incremented);
    });
  });
}

function incrementCategoryPopularity(db: Knex, category: string, amount: BigNumber, callback: ErrorCallback) {
  db.raw(`UPDATE categories SET popularity = popularity + :amount WHERE category = :category`, { amount: amount.toFixed(), category }).asCallback(callback);
}

function setMarketLastTrade(db: Knex, marketId: Address, blockNumber: number, callback: ErrorCallback) {
  db("markets").update("lastTradeBlockNumber", blockNumber).where({ marketId }).asCallback(callback);
}

export function updateOpenInterest(db: Knex, marketId: Address, callback: ErrorCallback) {
  db.first("numTicks").from("markets").where({ marketId }).asCallback((err: Error|null, marketRow?: { numTicks: BigNumber }): void => {
    if (err) return callback(err);
    if (marketRow == null) return callback(new Error(`No marketId for openInterest: ${marketId}`));
    const numTicks = marketRow.numTicks;
    db.first("supply").from("token_supply").join("tokens", "token_supply.token", "tokens.contractAddress").where({ marketId, symbol: "shares" })
      .asCallback((err: Error|null, shareTokenRow?: { supply: BigNumber }): void => {
        if (err) return callback(err);
        if (shareTokenRow == null) return callback(new Error(`No shareToken supply found for market: ${marketId}`));
        const openInterest = shareTokenRow.supply.multipliedBy(numTicks);
        db("markets").update({ openInterest: convertFixedPointToDecimal(openInterest, WEI_PER_ETHER) }).where({ marketId }).asCallback(callback);
      });
  });
}

export function updateVolumetrics(db: Knex, augur: Augur, category: string, marketId: Address, outcome: number, blockNumber: number, orderId: Bytes32, orderCreator: Address, tickSize: BigNumber, minPrice: BigNumber, maxPrice: BigNumber, isIncrease: boolean, callback: ErrorCallback): void {
  db.first("token_supply.supply").from("tokens").join("token_supply", "token_supply.token", "tokens.contractAddress").where({ outcome, marketId })
    .asCallback((err: Error|null, shareTokenRow?: { supply: BigNumber }): void => {
      if (err) return callback(err);
      if (shareTokenRow == null) return callback(new Error(`No shareToken found for market: ${marketId} outcome: ${outcome}`));
      const sharesOutstanding = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(shareTokenRow.supply, 10), tickSize).toFixed();
      db("markets").where({ marketId }).update({ sharesOutstanding })
        .asCallback((err: Error|null): void => {
          if (err) return callback(err);
          db.first("numCreatorShares", "numCreatorTokens", "price", "orderType", "amount").from("trades")
            .where({ marketId, outcome, orderId, blockNumber })
            .asCallback((err: Error|null, tradesRow?: Partial<TradesRow<BigNumber>>): void => {
              if (err) return callback(err);
              if (!tradesRow) return callback(new Error(`trade not found, orderId: ${orderId}`));
              let amount = tradesRow.amount!;
              if (!isIncrease) amount = amount.negated();
              const fullPrecisionPrice = augur.utils.convertDisplayPriceToOnChainPrice(tradesRow.price, minPrice, tickSize);
              series({
                market: (next) => incrementMarketVolume(db, marketId, amount, fullPrecisionPrice, next),
                outcome: (next) => incrementOutcomeVolume(db, marketId, outcome, amount, fullPrecisionPrice, next),
                marketLastTrade: (next) => setMarketLastTrade(db, marketId, blockNumber, next),
                category: (next) => incrementCategoryPopularity(db, category, amount, next),
                openInterest: (next) => updateOpenInterest(db, marketId, next),
              }, callback);
            });
        });
    });
}
