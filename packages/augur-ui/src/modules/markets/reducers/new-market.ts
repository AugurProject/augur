import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET,
  REMOVE_ALL_ORDER_FROM_NEW_MARKET,
} from 'modules/markets/actions/update-new-market';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import {
  ZERO,
  NEW_ORDER_GAS_ESTIMATE,
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { NewMarket, BaseAction, LiquidityOrder } from 'modules/types';
import { formatShares, formatDaiPrice } from 'utils/format-number';
import { EMPTY_STATE } from 'modules/create-market/constants';
import deepClone from 'utils/deep-clone';

export default function(
  newMarket: NewMarket = deepClone<NewMarket>(EMPTY_STATE),
  { type, data }: BaseAction
): NewMarket {
  switch (type) {
    case ADD_ORDER_TO_NEW_MARKET: {
      const orderToAdd = data.order;
      const {
        quantity,
        price,
        type,
        orderEstimate,
        outcomeName,
        outcomeId,
      } = orderToAdd;
      const existingOrders = newMarket.orderBook[outcomeId] || [];

      let orderAdded = false;

      const updatedOrders: LiquidityOrder[] = existingOrders.map(
        (order: LiquidityOrder) => {
          const orderInfo = Object.assign({}, order);
          if (
            createBigNumber(order.price).eq(createBigNumber(price)) &&
            order.type === type
          ) {
            orderInfo.quantity = createBigNumber(order.quantity).plus(
              createBigNumber(quantity)
            );
            (orderInfo.orderEstimate = createBigNumber(
              order.orderEstimate
            ).plus(createBigNumber(orderEstimate))),
              (orderInfo.shares = orderInfo.quantity);
            orderInfo.mySize = orderInfo.quantity;
            orderInfo.cumulativeShares = orderInfo.quantity;
            orderAdded = true;
            return orderInfo;
          }
          return order;
        }
      );

      if (!orderAdded) {
        updatedOrders.push({
          outcomeName,
          outcomeId,
          type,
          price,
          quantity,
          shares: quantity,
          mySize: quantity,
          cumulativeShares: quantity,
          orderEstimate: createBigNumber(orderEstimate),
          avgPrice: formatDaiPrice(price),
          unmatchedShares: formatShares(quantity),
          sharesEscrowed: formatShares(quantity),
          tokensEscrowed: formatDaiPrice(createBigNumber(orderEstimate)),
          id: updatedOrders.length,
        } as any);
      }

      const newUpdatedOrders = recalculateCumulativeShares(updatedOrders);
      const orderBook = {
        ...newMarket.orderBook,
        [outcomeId]: newUpdatedOrders,
      };

      const { initialLiquidityDai, initialLiquidityGas } = calculateLiquidity(
        orderBook
      );

      return {
        ...newMarket,
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
      };
    }
    case REMOVE_ORDER_FROM_NEW_MARKET: {
      const { outcome, orderId } = data && data.order;
      const updatedOrders = newMarket.orderBook[outcome].filter(
        order => order.id !== orderId
      );
      const updatedOutcomeUpdatedShares = recalculateCumulativeShares(
        updatedOrders
      );
      let orderBook = {
        ...newMarket.orderBook,
        [outcome]: updatedOutcomeUpdatedShares,
      };

      const { initialLiquidityDai, initialLiquidityGas } = calculateLiquidity(
        orderBook
      );
      if (initialLiquidityDai.eq(createBigNumber(0))) {
        orderBook = {};
      }
      return {
        ...newMarket,
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
      };
    }
    case REMOVE_ALL_ORDER_FROM_NEW_MARKET: {
      return {
        ...newMarket,
        initialLiquidityDai: ZERO,
        initialLiquidityGas: ZERO,
        orderBook: {},
      };
    }
    case UPDATE_NEW_MARKET: {
      const { newMarketData } = data;
      return {
        ...newMarket,
        ...newMarketData,
      };
    }
    case RESET_STATE:
    case CLEAR_NEW_MARKET:
      return deepClone<NewMarket>(EMPTY_STATE);
    default:
      return newMarket;
  }
}

const recalculateCumulativeShares = orders => {
  let counterBids = 0;
  let counterAsks = 0;
  const bids = orders
    .filter(a => a.type === 'sell')
    .sort((a, b) => Number(a.price) - Number(b.price))
    .map(order => {
      counterBids = counterBids + Number(order.shares);
      order.cumulativeShares = String(counterBids);
      return order;
    });

  const asks = orders
    .filter(a => a.type === 'buy')
    .sort((a, b) => Number(b.price) - Number(a.price))
    .map(order => {
      counterAsks = counterAsks + Number(order.shares);
      order.cumulativeShares = String(counterAsks);
      return order;
    });
  return [...bids, ...asks];
};

const calculateLiquidity = orderBook => {
  let initialLiquidityDai = ZERO;
  let initialLiquidityGas = ZERO;
  Object.keys(orderBook).map(id => {
    orderBook[id].map((order: LiquidityOrder) => {
      initialLiquidityDai = initialLiquidityDai.plus(order.orderEstimate);
      initialLiquidityGas = createBigNumber(initialLiquidityGas).plus(
        NEW_ORDER_GAS_ESTIMATE
      );
    });
  });
  return { initialLiquidityDai, initialLiquidityGas };
};
