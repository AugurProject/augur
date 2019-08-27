import { createBigNumber } from "utils/create-big-number";
import { convertOnChainPriceToDisplayPrice, Events, Getters } from "@augurproject/sdk/build";
import { TX_PRICE, TX_OUTCOMES, TX_PRICES, TX_TYPES, TX_OUTCOME_ID, TX_ORDER_TYPE, ZERO, BUY, SELL } from "modules/common/constants";
import { deleteSuccessfulLiquidityOrder, updateLiquidityOrderStatus } from "modules/orders/actions/liquidity-management";

export function deleteLiquidityOrder(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const properties = processLiquidityOrder(tx, market);
  dispatch(
    deleteSuccessfulLiquidityOrder({
      txParamHash: properties.transactionHash,
      ...properties,
    })
  );
}

export function deleteMultipleLiquidityOrders(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const payloads = processMultipleLiquidityOrders(tx, market)
  payloads.map(payload => dispatch(deleteSuccessfulLiquidityOrder(payload)));
}

export function setLiquidityMultipleOrdersStatus(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const payloads = processMultipleLiquidityOrders(tx, market)
  payloads.map(payload => dispatch(updateLiquidityOrderStatus(payload)));
}

export function processMultipleLiquidityOrders(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo
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

export function setLiquidityOrderStatus(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const properties = processLiquidityOrder(tx, market);
  dispatch(
    updateLiquidityOrderStatus({
      txParamHash: properties.transactionHash,
      ...properties,
      eventName: tx.eventName,
      hash: tx.hash,
    })
  );
}

export function processLiquidityOrder(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo
) {
  const { transaction } = tx;
  const { transactionHash, tickSize, minPrice } = market;
  const outcomeId = transaction.params[TX_OUTCOME_ID];
  const orderType = transaction.params[TX_ORDER_TYPE];
  const onChainPrice = transaction.params[TX_PRICE];
  return {
    ...processOnChainPriceOrderType(
      onChainPrice,
      minPrice,
      tickSize,
      orderType
    ),
    outcomeId,
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
