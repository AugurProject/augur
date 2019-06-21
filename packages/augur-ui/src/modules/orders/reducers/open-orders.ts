import {
  UPDATE_USER_OPEN_ORDERS,
} from "modules/markets/actions/market-trading-history-management";
import { BaseAction, OpenOrders } from "modules/types";

const DEFAULT_STATE: OpenOrders = {};

export default function(userOpenOrders: OpenOrders = DEFAULT_STATE, { type, data }: BaseAction): OpenOrders {
  switch (type) {
    case UPDATE_USER_OPEN_ORDERS: {
      const { openOrders } = data;

      return {
        ...userOpenOrders,
        ...openOrders,
      };
    }
    default:
      return userOpenOrders;
  }
}
