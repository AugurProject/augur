export const ADD_ORDER_TO_NEW_MARKET = "ADD_ORDER_TO_NEW_MARKET";
export const REMOVE_ORDER_FROM_NEW_MARKET = "REMOVE_ORDER_FROM_NEW_MARKET";
export const UPDATE_NEW_MARKET = "UPDATE_NEW_MARKET";
export const CLEAR_NEW_MARKET = "CLEAR_NEW_MARKET";

export function invalidateMarketCreation(error) {
  // error param is currently not utilized
  return dispatch => {
    dispatch(updateNewMarket({ isValid: false }));
  };
}

// order: {
//   outcome
//   type
//   price
//   quantity
//   orderEstimate
// }
export function addOrderToNewMarket(order) {
  return { type: ADD_ORDER_TO_NEW_MARKET, data: { order } };
}

// order: {
//   outcome
//   index
// }
export function removeOrderFromNewMarket(order) {
  return { type: REMOVE_ORDER_FROM_NEW_MARKET, data: { order } };
}

export function updateNewMarket(newMarketData) {
  return { type: UPDATE_NEW_MARKET, data: { newMarketData } };
}

export function clearNewMarket() {
  return { type: CLEAR_NEW_MARKET };
}
