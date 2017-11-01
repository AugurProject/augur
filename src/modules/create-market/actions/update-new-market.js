// import { NEW_MARKET_REVIEW } from 'modules/create-market/constants/new-market-creation-steps'

export const ADD_ORDER_TO_NEW_MARKET = 'ADD_ORDER_TO_NEW_MARKET'
export const REMOVE_ORDER_FROM_NEW_MARKET = 'REMOVE_ORDER_FROM_NEW_MARKET'
export const UPDATE_NEW_MARKET = 'UPDATE_NEW_MARKET'
export const CLEAR_NEW_MARKET = 'CLEAR_NEW_MARKET'

export function invalidateMarketCreation(error) {
  // error param is currently not utilized
  return (dispatch) => {
    dispatch(updateNewMarket({ isValid: false }))
  }
}

export function addOrderToNewMarket(data) {
  return { type: ADD_ORDER_TO_NEW_MARKET, data }
}

export function removeOrderFromNewMarket(data) {
  return { type: REMOVE_ORDER_FROM_NEW_MARKET, data }
}

export function updateNewMarket(data) {
  return { type: UPDATE_NEW_MARKET, data }
}

export function clearNewMarket() {
  return { type: CLEAR_NEW_MARKET }
}
