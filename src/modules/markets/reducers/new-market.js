import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { SETTLEMENT_FEE_DEFAULT } from "modules/markets/constants/new-market-constraints";
import { DEFAULT_SCALAR_TICK_SIZE } from "augur.js/src/constants";

import { createBigNumber } from "utils/create-big-number";

const DEFAULT_STATE = () => ({
  isValid: false,
  validations: [
    {
      description: "",
      category: "",
      tag1: "",
      tag2: "",
      type: "",
      designatedReporterType: "",
      designatedReporterAddress: "",
      expirySourceType: "",
      endTime: "",
      hour: "",
      minute: "",
      meridiem: ""
    },
    {
      settlementFee: ""
    }
  ],
  currentStep: 0,
  type: "yesNo",
  outcomes: Array(8).fill(""),
  scalarSmallNum: "",
  scalarBigNum: "",
  scalarDenomination: "",
  description: "esting designate reporting with ledg blah blah",
  expirySourceType: "EXPIRY_SOURCE_GENERIC",
  expirySource: "",
  designatedReporterType: "DESIGNATED_REPORTER_SELF",
  designatedReporterAddress: "",
  endTime: {},
  tickSize: DEFAULT_SCALAR_TICK_SIZE,
  hour: "1",
  minute: "1",
  meridiem: "AM",
  detailsText: "",
  category: "source",
  tag1: "bob1",
  tag2: "bob2",
  settlementFee: SETTLEMENT_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  orderBookSeries: {}, // for order book chart
  initialLiquidityEth: createBigNumber(0),
  initialLiquidityGas: createBigNumber(0),
  creationError:
    "Unable to create market.  Ensure your market is unique and all values are valid."
});

export default function(newMarket = DEFAULT_STATE(), action) {
  switch (action.type) {
    case ADD_ORDER_TO_NEW_MARKET: {
      const orderToAdd = action.data.order;
      const { quantity, price, type, orderEstimate, outcome } = orderToAdd;
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
      const { outcome, index } = action.data && action.data.order;
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
      const { newMarketData } = action.data;
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
