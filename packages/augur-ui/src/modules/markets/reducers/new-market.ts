import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";
import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  SETTLEMENT_FEE_DEFAULT,
  EXPIRY_SOURCE_GENERIC,
  DESIGNATED_REPORTER_SELF,
  AFFILIATE_FEE_DEFAULT,
  YES_NO,
  YES_NO_OUTCOMES,
  ZERO,
  ONE,
  NEW_ORDER_GAS_ESTIMATE
} from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";
import { NewMarket, BaseAction, LiquidityOrder } from "modules/types";
import { formatShares, formatDai } from 'utils/format-number';

export const DEFAULT_STATE: NewMarket = {
  isValid: false,
  validations: [
    {
      description: null,
      categories: ["", "", ""],
      designatedReporterAddress: null,
      expirySourceType: null,
      setEndTime: null,
      hour: null,
      minute: null,
      meridiem: null,
      scalarDenomination: null,
      outcomes: ["", ""],
    },
    {
      settlementFee: "",
    },
  ],
  currentStep: 0,
  marketType: YES_NO,
  outcomes: ["", ""],
  outcomesFormatted: YES_NO_OUTCOMES,
  scalarSmallNum: "",
  scalarBigNum: "",
  scalarDenomination: "",
  description: "",
  expirySourceType: EXPIRY_SOURCE_GENERIC,
  expirySource: "",
  backupSource: "",
  designatedReporterType: DESIGNATED_REPORTER_SELF,
  designatedReporterAddress: "",
  endTime: null,
  setEndTime: null,
  tickSize: 0.01,
  hour: null,
  minute: null,
  meridiem: "AM",
  offset: 0,
  offsetName: null,
  timezone: null,
  detailsText: "",
  categories: ["", "", ""],
  settlementFee: SETTLEMENT_FEE_DEFAULT,
  affiliateFee: AFFILIATE_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  minPrice: "0",
  maxPrice: "1",
  minPriceBigNumber: ZERO,
  maxPriceBigNumber: ONE,
  initialLiquidityDai: ZERO,
  initialLiquidityGas: ZERO
};

export default function(newMarket: NewMarket = DEFAULT_STATE, { type, data }: BaseAction): NewMarket {
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

      const updatedOrders: LiquidityOrder[] = existingOrders.map((order: LiquidityOrder) => {
          const orderInfo = Object.assign({}, order);
        if (createBigNumber(order.price).eq(createBigNumber(price)) && order.type === type) {
          orderInfo.quantity = createBigNumber(order.quantity).plus(createBigNumber(quantity));
          orderInfo.orderEstimate = createBigNumber(order.orderEstimate).plus(
            createBigNumber(orderEstimate)
          ),
          orderAdded = true;
          return orderInfo;
        }
        return order;
      });

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
          avgPrice: formatDai(price),
          unmatchedShares: formatShares(quantity),
          sharesEscrowed: formatShares(quantity),
          tokensEscrowed: formatDai(createBigNumber(orderEstimate)),
          id: updatedOrders.length,
        } as any);
      }

      const newUpdatedOrders = recalculateCumulativeShares(updatedOrders);
      const orderBook = {
        ...newMarket.orderBook,
        [outcomeId]: newUpdatedOrders,
      };

      const {initialLiquidityDai, initialLiquidityGas} = calculateLiquidity(orderBook);

      return {
        ...newMarket,
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
      };
    }
    case REMOVE_ORDER_FROM_NEW_MARKET: {
      const { outcome, orderId } = data && data.order;
      const updatedOrders = newMarket.orderBook[outcome].filter(order => order.id !== orderId);
      const updatedOutcomeUpdatedShares = recalculateCumulativeShares(updatedOrders);
      const orderBook = {
        ...newMarket.orderBook,
        [outcome]: updatedOutcomeUpdatedShares,
      }

      const {initialLiquidityDai, initialLiquidityGas} = calculateLiquidity(orderBook);

      return {
        ...newMarket,
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
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
      return {
        ...DEFAULT_STATE,
        validations: [{
          description: null,
          categories: ["", "", ""],
          designatedReporterAddress: null,
          expirySourceType: null,
          endTime: null,
          hour: null,
          minute: null,
          meridiem: null,
          scalarDenomination: null,
          outcomes: ["", ""],
        },
        {
          settlementFee: "",
        }],
      };
    default:
      return newMarket;
  }
}

const recalculateCumulativeShares = (orders) => {
  let counterBids = 0;
  let counterAsks = 0;
  const bids = orders
    .filter(a => a.type === 'sell')
    .sort((a,b) => Number(a.price) - Number(b.price))
    .reverse()
    .map(orders => {
      counterBids = counterBids + Number(orders.shares);
      orders.cumulativeShares = String(counterBids);
      return orders;
  });

  const asks = orders
    .filter(a => a.type === 'buy')
    .sort((a,b) => Number(a.price) - Number(b.price))
    .map(order => {
      counterAsks = counterAsks + Number(order.shares);
      order.cumulativeShares = String(counterAsks);
      return order;
  });

  return [...bids, ...asks];
};

const calculateLiquidity = (orderBook) => {
  let initialLiquidityDai = ZERO;
  let initialLiquidityGas = ZERO;
  Object.keys(orderBook).map(id => {
    orderBook[id].map((order: LiquidityOrder) => {
      initialLiquidityDai = initialLiquidityDai.plus(order.orderEstimate)
      initialLiquidityGas = createBigNumber(initialLiquidityGas).plus(
        NEW_ORDER_GAS_ESTIMATE
      );
    })
  })
  return {initialLiquidityDai, initialLiquidityGas}
}
