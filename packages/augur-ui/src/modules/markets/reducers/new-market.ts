import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { SETTLEMENT_FEE_DEFAULT, AFFILIATE_FEE_DEFAULT, YES_NO } from "modules/common/constants";

import { createBigNumber } from "utils/create-big-number";
import { NewMarket, BaseAction, LiquidityOrder } from "modules/types";

export const DEFAULT_STATE: NewMarket = {
  isValid: false,
  validations: [
    {
      description: null,
      category: null,
      tag1: "",
      tag2: "",
      type: null,
      designatedReporterType: null,
      designatedReporterAddress: null,
      expirySourceType: null,
      endTime: null,
      hour: null,
      minute: null,
      meridiem: null
    },
    {
      settlementFee: ""
    }
  ],
  currentStep: 0,
  marketType: YES_NO,
  outcomes: Array(2).fill(""),
  outcomesFormatted: [
    {
      id: 0,
      description: "Invalid",
      isTradable: true,
    },
    {
      id: 1,
      description: "No"
    },
    {
      id: 2,
      description: "Yes",
      isTradable: true,
    },
  ],
  scalarSmallNum: "",
  scalarBigNum: "",
  scalarDenomination: "",
  description: "",
  expirySourceType: "",
  expirySource: "",
  designatedReporterType: "",
  designatedReporterAddress: "",
  endTime: null,
  tickSize: 0.01,
  hour: null,
  minute: null,
  meridiem: null,
  detailsText: "",
  category: "",
  tag1: "",
  tag2: "",
  settlementFee: SETTLEMENT_FEE_DEFAULT,
  affiliateFee: AFFILIATE_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  minPrice: 0,
  maxPrice: 1,
  minPriceBigNumber: createBigNumber(0),
  maxPriceBigNumber: createBigNumber(1),
  initialLiquidityEth: createBigNumber(0),
  initialLiquidityGas: createBigNumber(0),
  creationError:
    "Unable to create market.  Ensure your market is unique and all values are valid."
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
        outcome,
        outcomeName
      } = orderToAdd;
      const existingOrders = newMarket.orderBook[outcome] || [];
      let orderAdded = false;
      const updatedOrders = existingOrders.reduce((Orders: Array<LiquidityOrder>, order) => {
        const orderInfo = Object.assign({}, order);
        if (createBigNumber(order.price).eq(createBigNumber(price)) && order.type === type) {
          orderInfo.quantity = createBigNumber(order.quantity).plus(createBigNumber(quantity)).toNumber();
          orderInfo.orderEstimate = createBigNumber(order.orderEstimate).plus(
            createBigNumber(orderEstimate.replace(" DAI", ""))
          ).toNumber();
          orderAdded = true;
        }
        Orders.push(orderInfo);
        return Orders;
      }, []);

      if (!orderAdded) {
        updatedOrders.push({
          outcomeName,
          type,
          price,
          quantity,
          shares: quantity,
          mySize: quantity,
          cummulativeShares: quantity,
          orderEstimate: createBigNumber(orderEstimate.replace(" DAI", "")),
          id: updatedOrders.length,
        });
      }

      return {
        ...newMarket,
        orderBook: {
          ...newMarket.orderBook,
          [outcome]: updatedOrders
        }
      };
    }
    case REMOVE_ORDER_FROM_NEW_MARKET: {
      const { outcome, index } = data && data.order;
      const updatedOutcome = [
        ...newMarket.orderBook[outcome].slice(0, index),
        ...newMarket.orderBook[outcome].slice(index + 1)
      ];

      return {
        ...newMarket,
        orderBook: {
          ...newMarket.orderBook,
          [outcome]: updatedOutcome
        }
      };
    }
    case UPDATE_NEW_MARKET: {
      const { newMarketData } = data;
      return {
        ...newMarket,
        ...newMarketData
      };
    }
    case RESET_STATE:
    case CLEAR_NEW_MARKET:
      return DEFAULT_STATE;
    default:
      return newMarket;
  }
}
