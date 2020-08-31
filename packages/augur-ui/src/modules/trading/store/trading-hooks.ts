import { useReducer } from 'react';
import { MOCK_TRADING_STATE, TRADING_ACTIONS, DEFAULT_ORDER_PROPERTIES } from 'modules/trading/store/constants';

const {
  CLEAR_ORDER_PROPERTIES,
  UPDATE_ORDER_PROPERTIES,
  UPDATE_SELECTED_NAV,
} = TRADING_ACTIONS;

export function TradingReducer(state, action) {
  let updatedState = { ...state };
  switch (action.type) {
    case CLEAR_ORDER_PROPERTIES: {
      updatedState.orderProperties = DEFAULT_ORDER_PROPERTIES;
      break;
    }
    case UPDATE_SELECTED_NAV: {
      updatedState.orderProperties.selectedNav = action.selectedNav;
      break;
    }
    case UPDATE_ORDER_PROPERTIES: {
      console.log("Update order properties", action.orderProperties);
      const { orderProperties } = action;
      updatedState.orderProperties = {
        ...updatedState.orderProperties,
        ...orderProperties,
      };
      console.log('updates:', updatedState.orderProperties);
      break;
    }
    default:
      console.log('trading DEFAULT:', updatedState);
  }
  window.trading = updatedState;
  window.stores.trading = updatedState;
  return updatedState;
}

export const useTrading = (defaultState = MOCK_TRADING_STATE) => {
  const [state, dispatch] = useReducer(TradingReducer, defaultState);
  window.trading = state;
  window.stores.trading = state;
  return {
    ...state,
    actions: {
      clearOrderProperties: () => dispatch({ type: CLEAR_ORDER_PROPERTIES }),
      updateOrderProperties: (orderProperties) => dispatch({ type: UPDATE_ORDER_PROPERTIES, orderProperties }),
      updateSelectedNav: (selectedNav) => dispatch({ type: UPDATE_SELECTED_NAV, selectedNav }),
    },
  };
};
