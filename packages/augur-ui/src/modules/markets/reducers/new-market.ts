import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { SETTLEMENT_FEE_DEFAULT } from "modules/common-elements/constants";
import { DEFAULT_SCALAR_TICK_SIZE } from "@augurproject/augur.js/src/constants";

import { createBigNumber } from "utils/create-big-number";
import { NewMarket, BaseAction } from "modules/types";

const DEFAULT_STATE: NewMarket = () => ({
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
  type: "",
  outcomes: Array(8).fill(""),
  scalarSmallNum: "",
  scalarBigNum: "",
  scalarDenomination: "",
  description: "",
  expirySourceType: "",
  expirySource: "",
  designatedReporterType: "",
  designatedReporterAddress: "",
  endTime: {},
  tickSize: DEFAULT_SCALAR_TICK_SIZE,
  hour: "",
  minute: "",
  meridiem: "",
  detailsText: "",
  category: "",
  tag1: "",
  tag2: "",
  settlementFee: SETTLEMENT_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  orderBookSeries: {}, // for order book chart
  initialLiquidityEth: createBigNumber(0),
  initialLiquidityGas: createBigNumber(0),
  creationError:
    "Unable to create market.  Ensure your market is unique and all values are valid."
});

export default function(newMarket: NewMarket = DEFAULT_STATE(), { type, data }: BaseAction) {
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
      const updatedOrders = existingOrders.reduce((Orders, order) => {
        const orderInfo = Object.assign({}, order);
        if (order.price.eq(price) && order.type === type) {
          orderInfo.quantity = order.quantity.plus(quantity);
          orderInfo.orderEstimate = order.orderEstimate.plus(
            orderEstimate.replace(" ETH", "")
          );
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
          orderEstimate: createBigNumber(orderEstimate.replace(" ETH", ""))
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
      return DEFAULT_STATE();
    default:
      return newMarket;
  }
}
