import { useReducer } from 'react';
import {
  MOCK_TRADING_STATE,
  TRADING_ACTIONS,
  DEFAULT_ORDER_PROPERTIES,
} from 'modules/trading/store/constants';
import { windowRef } from 'utils/window-ref';
const {
  CLEAR_ORDER_PROPERTIES,
  UPDATE_ORDER_PROPERTIES,
  UPDATE_SELECTED_NAV,
} = TRADING_ACTIONS;

export function TradingReducer(state, action) {
  let updatedState = { ...state };
  switch (action.type) {
    case CLEAR_ORDER_PROPERTIES: {
      const { selectedNav, expirationDate } = updatedState.orderProperties;
      updatedState.orderProperties = {
        ...DEFAULT_ORDER_PROPERTIES,
        expirationDate,
        selectedNav,
      };
      break;
    }
    case UPDATE_SELECTED_NAV: {
      updatedState.orderProperties.selectedNav = action.selectedNav;
      break;
    }
    case UPDATE_ORDER_PROPERTIES: {
      const { orderProperties } = action;
      updatedState.orderProperties = {
        ...updatedState.orderProperties,
        ...orderProperties,
      };
      break;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by Trading reducer`);
  }
  console.log('trading', action);
  windowRef.trading = updatedState;
  windowRef.stores.trading = updatedState;
  return updatedState;
}

export const useTrading = (presetOrderProperties, defaultState = MOCK_TRADING_STATE) => {
  const [state, dispatch] = useReducer(TradingReducer, {
    ...defaultState,
    orderProperties: {
      ...defaultState.orderProperties,
      ...presetOrderProperties,
    },
  });
  windowRef.trading = state;
  windowRef.stores.trading = state;
  return {
    ...state,
    actions: {
      clearOrderProperties: () => dispatch({ type: CLEAR_ORDER_PROPERTIES }),
      updateOrderProperties: orderProperties =>
        dispatch({ type: UPDATE_ORDER_PROPERTIES, orderProperties }),
      updateSelectedNav: selectedNav =>
        dispatch({ type: UPDATE_SELECTED_NAV, selectedNav }),
    },
  };
};
