import { NewMarket, UIOrder } from "modules/types";
import { AppStatus } from "modules/app/store/app-status";

export const ADD_ORDER_TO_NEW_MARKET = "ADD_ORDER_TO_NEW_MARKET";
export const REMOVE_ORDER_FROM_NEW_MARKET = "REMOVE_ORDER_FROM_NEW_MARKET";
export const REMOVE_ALL_ORDER_FROM_NEW_MARKET = "REMOVE_ALL_ORDER_FROM_NEW_MARKET";
export const UPDATE_NEW_MARKET = "UPDATE_NEW_MARKET";
export const CLEAR_NEW_MARKET = "CLEAR_NEW_MARKET";

// order: {
//   outcome
//   type
//   price
//   quantity
//   orderEstimate
// }
export function addOrderToNewMarket(order: UIOrder) {
  AppStatus.actions.addOrderToNewMarket(order);
}

export function removeAllOrdersFromNewMarket() {
  AppStatus.actions.removeAllOrdersFromNewMarket();
}

// order: {
//   outcome
//   index
// }
export function removeOrderFromNewMarket(order: UIOrder) {
  AppStatus.actions.removeOrderFromNewMarket(order);
}

export function updateNewMarket(newMarketData: NewMarket) {
  AppStatus.actions.updateNewMarket(newMarketData);
}

export function clearNewMarket() {
  AppStatus.actions.clearNewMarket();
}
