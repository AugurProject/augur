import { createBigNumber } from "utils/create-big-number";
import type { TXStatus, MarketInfo } from "@augurproject/sdk-lite"
import { convertOnChainPriceToDisplayPrice } from "@augurproject/utils"
import { TX_OUTCOMES, TX_PRICES, TX_TYPES, ZERO, BUY, SELL } from "modules/common/constants";
import { PendingOrders } from "modules/app/store/pending-orders";

export function deleteMultipleLiquidityOrders(
  tx: TXStatus,
  market: MarketInfo,
) {
  const payloads = processMultipleLiquidityOrders(tx, market)
  payloads.map(payload => PendingOrders.actions.updateSuccessfulLiquidity(payload));
}

export function setLiquidityMultipleOrdersStatus(
  tx: TXStatus,
  market: MarketInfo,
) {
  const payloads = processMultipleLiquidityOrders(tx, market);
  payloads.map(payload => PendingOrders.actions.updateLiquidityStatus(payload));
}

export function processMultipleLiquidityOrders(
  tx: TXStatus,
  market: MarketInfo
) {
  const outcomes = tx.transaction.params[TX_OUTCOMES];
  const prices = tx.transaction.params[TX_PRICES];
  const orderTypes = tx.transaction.params[TX_TYPES];
  const { transactionHash, tickSize, minPrice } = market;
  let i = 0;
  const payloads = [];
  for(i; i < outcomes.length; i++) {
    const outcomeId = outcomes[i];
    const price = prices[i];
    const orderType = orderTypes[i];
    const properties = processOnChainPriceOrderType(price, minPrice, tickSize, orderType);
    payloads.push({
      txParamHash: transactionHash,
      outcomeId,
      ...properties,
      eventName: tx.eventName,
      hash: tx.hash,
    });
  }
  return payloads;
}
interface Tx {
  outcomeId: number,
  eventName: string,
  orderType: string,
  orderPrice: string
}

export function processLiquidityOrder(
  tx: Tx,
  market: MarketInfo
) {
  const { outcomeId, orderType, orderPrice } = tx;
  const { transactionHash } = market;
  return {
    outcomeId,
    type: orderType,
    price: orderPrice,
    transactionHash,
  };
}

export function processOnChainPriceOrderType(
  onChainPrice,
  minPrice,
  tickSize,
  orderType
) {
  const price = convertOnChainPriceToDisplayPrice(
    createBigNumber(onChainPrice),
    createBigNumber(minPrice),
    createBigNumber(tickSize)
  ).toString();
  const type = orderType.eq(ZERO) ? BUY : SELL;
  return { type, price };
}
