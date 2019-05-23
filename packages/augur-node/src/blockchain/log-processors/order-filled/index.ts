import { Address, Augur, BigNumber, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, TradesRow } from "../../../types";
import Knex from "knex";
import { updateOrder } from "./update-order";
import { updateVolumetrics } from "./update-volumetrics";
import { augurEmitter } from "../../../events";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";
import { fixedPointToDecimal, numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { BN_WEI_PER_ETHER, SubscriptionEventNames } from "../../../constants";
import { removeOutcomeValue, updateOutcomeValueFromOrders } from "../profit-loss/update-outcome-value";
import {
  updateProfitLossBuyShares,
  updateProfitLossSellEscrowedShares,
  updateProfitLossSellShares
} from "../profit-loss/update-profit-loss";
import { convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "../../../utils";

interface TokensRowWithNumTicksAndCategory extends TokensRow {
  category: string;
  minPrice: BigNumber;
  maxPrice: BigNumber;
  numTicks: BigNumber;
}

export async function processOrderFilledLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const shareToken: Address = log.shareToken;
    const blockNumber: number = log.blockNumber;
    const filler: Address = log.filler;
    const tokensRow: TokensRow|undefined = await db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken });

    if (!tokensRow) throw new Error(`ORDER FILLED: market and outcome not found for shareToken: ${shareToken} (${log.transactionHash})`);
    const marketId = tokensRow.marketId;
    const outcome = tokensRow.outcome!;
    const marketsRow: MarketsRow<BigNumber>|undefined = await db.first("minPrice", "maxPrice", "numTicks", "category", "numOutcomes").from("markets").where({ marketId });

    if (!marketsRow) throw new Error(`market not found: ${marketId}`);
    const minPrice = marketsRow.minPrice;
    const maxPrice = marketsRow.maxPrice;
    const numTicks = marketsRow.numTicks;
    const numOutcomes = marketsRow.numOutcomes;
    const category = marketsRow.category;
    const orderId = log.orderId;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const ordersRow: OrdersRow<BigNumber>|undefined = await db.first("orderCreator", "fullPrecisionPrice", "orderType").from("orders").where({ orderId });

    if (!ordersRow) throw new Error(`order not found, orderId: ${orderId} (${log.transactionHash})`);
    const orderCreator = ordersRow.orderCreator;
    const price = ordersRow.fullPrecisionPrice;
    const orderType = ordersRow.orderType;
    const amount = convertOnChainAmountToDisplayAmount(new BigNumber(log.amountFilled), tickSize);
    const numCreatorTokens = fixedPointToDecimal(new BigNumber(log.numCreatorTokens), BN_WEI_PER_ETHER);
    const numCreatorShares = convertOnChainAmountToDisplayAmount(new BigNumber(log.numCreatorShares), tickSize);
    const numFillerTokens = fixedPointToDecimal(new BigNumber(log.numFillerTokens), BN_WEI_PER_ETHER);
    const numFillerShares = convertOnChainAmountToDisplayAmount(new BigNumber(log.numFillerShares), tickSize);
    const marketCreatorFees = fixedPointToDecimal(new BigNumber(log.marketCreatorFees), BN_WEI_PER_ETHER);
    const reporterFees = fixedPointToDecimal(new BigNumber(log.reporterFees), BN_WEI_PER_ETHER);
    const tradeData = formatBigNumberAsFixed<TradesRow<BigNumber>, TradesRow<string>>({
      marketId,
      outcome,
      orderId,
      creator: orderCreator,
      orderType,
      filler,
      shareToken,
      blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      tradeGroupId: log.tradeGroupId,
      numCreatorTokens,
      numCreatorShares,
      numFillerTokens,
      numFillerShares,
      price,
      amount,
      marketCreatorFees,
      reporterFees,
    });
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, Object.assign({}, log, tradeData));
    await db.insert(tradeData).into("trades");

    await updateVolumetrics(db, augur, category, marketId, outcome, blockNumber, orderId, orderCreator, tickSize, minPrice, maxPrice, true);

    await updateOrder(db, augur, marketId, orderId, amount, orderCreator, filler, tickSize, minPrice);

    await updateOutcomeValueFromOrders(db, marketId, outcome, log.transactionHash, orderType === "buy" ? price : maxPrice.minus(price));
    if (numOutcomes === 2) {
      const otherOutcome = outcome === 0 ? 1 : 0;
      await updateOutcomeValueFromOrders(db, marketId, otherOutcome, log.transactionHash, orderType === "sell" ? price : maxPrice.minus(price));
    }
    const orderOutcome = [outcome];
    const otherOutcomes = Array.from(Array(numOutcomes).keys());
    otherOutcomes.splice(outcome, 1);
    const displayRange = convertOnChainPriceToDisplayPrice(maxPrice.minus(minPrice), minPrice, tickSize);
    if (numCreatorTokens.gt(0)) {
      await updateProfitLossBuyShares(db, marketId, orderCreator, numCreatorTokens, orderType === "buy" ? orderOutcome : otherOutcomes, log.transactionHash);
    }
    if (numFillerTokens.gt(0)) {
      await updateProfitLossBuyShares(db, marketId, filler, numFillerTokens, orderType === "sell" ? orderOutcome : otherOutcomes, log.transactionHash);
    }
    const creatorShares = new BigNumber(numCreatorShares);
    const fillerShares = new BigNumber(numFillerShares);
    const actualPrice = price.minus(minPrice);
    if (creatorShares.gt(0)) {
      await updateProfitLossSellEscrowedShares(db, marketId, creatorShares, orderCreator, orderType === "buy" ? otherOutcomes : orderOutcome, creatorShares.multipliedBy(orderType === "buy" ? displayRange.minus(actualPrice) : actualPrice), log.transactionHash);
    }
    if (fillerShares.gt(0)) {
      await updateProfitLossSellShares(db, marketId, fillerShares, filler, orderType === "sell" ? otherOutcomes : orderOutcome, fillerShares.multipliedBy(orderType === "sell" ? displayRange.minus(actualPrice) : actualPrice), log.transactionHash);
    }
  };
}

export async function processOrderFilledLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const shareToken: Address = log.shareToken;
    const blockNumber: number = log.blockNumber;
    const tokensRow: TokensRowWithNumTicksAndCategory|undefined = await db.first("tokens.marketId", "tokens.outcome", "markets.numTicks", "markets.category", "markets.minPrice", "markets.maxPrice").from("tokens").join("markets", "tokens.marketId", "markets.marketId").where("tokens.contractAddress", shareToken);

    if (!tokensRow) throw new Error(`market and outcome not found for ShareToken: ${shareToken} (${log.transactionHash})`);
    const marketId = tokensRow.marketId;
    const outcome = tokensRow.outcome!;
    const numTicks = tokensRow.numTicks;
    const minPrice = tokensRow.minPrice;
    const maxPrice = tokensRow.maxPrice;
    const category = tokensRow.category;
    const orderId = log.orderId;
    const ordersRow: OrdersRow<BigNumber>|undefined = await db.first("orderCreator", "fullPrecisionPrice", "orderType").from("orders").where({ orderId });

    if (!ordersRow) throw new Error(`order not found, orderId: ${orderId} (${log.transactionHash}`);
    const orderCreator = ordersRow.orderCreator;
    const price = ordersRow.fullPrecisionPrice;
    const orderType = ordersRow.orderType;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const numCreatorTokens = fixedPointToDecimal(new BigNumber(log.numCreatorTokens), BN_WEI_PER_ETHER);
    const numCreatorShares = convertOnChainAmountToDisplayAmount(new BigNumber(log.numCreatorShares), new BigNumber(tickSize));
    const numFillerTokens = fixedPointToDecimal(new BigNumber(log.numFillerTokens), BN_WEI_PER_ETHER);
    const numFillerShares = convertOnChainAmountToDisplayAmount(new BigNumber(log.numFillerShares), new BigNumber(tickSize));
    const marketCreatorFees = fixedPointToDecimal(new BigNumber(log.marketCreatorFees), BN_WEI_PER_ETHER);
    const reporterFees = fixedPointToDecimal(new BigNumber(log.reporterFees), BN_WEI_PER_ETHER);
    const amount = convertOnChainAmountToDisplayAmount(new BigNumber(log.amountFilled), tickSize);

    await updateVolumetrics(db, augur, category, marketId, outcome, blockNumber, orderId, orderCreator, tickSize, minPrice, maxPrice, false);
    await db.from("trades").where({ marketId, outcome, orderId, blockNumber }).del();
    await updateOrder(db, augur, marketId, orderId, amount.multipliedBy(new BigNumber(-1)), orderCreator, log.filler, tickSize, minPrice);
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, Object.assign({}, log, {
      marketId,
      outcome,
      creator: orderCreator,
      orderType,
      numCreatorTokens,
      numCreatorShares,
      numFillerTokens,
      numFillerShares,
      price,
      amount,
      marketCreatorFees,
      reporterFees,
    }));
    await removeOutcomeValue(db, log.transactionHash);
  };
}
