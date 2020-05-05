import { useReducer } from 'react';
import { MARKETS_ACTIONS, MOCK_MARKETS_STATE, DEFAULT_MARKETS_STATE } from 'modules/markets/store/constants';

const {
  UPDATE_ORDER_BOOK,
  CLEAR_ORDER_BOOK
} = MARKETS_ACTIONS;

export function MarketsReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, orderBook } = action;
      updatedState.orderBooks = {
        ...updatedState.orderBooks,
        [marketId]: orderBook,
      };
      return updatedState;
    }
    case CLEAR_ORDER_BOOK: {
      updatedState.orderBooks = DEFAULT_MARKETS_STATE.orderBooks;
      return updatedState;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by Markets reducer`);
  }
}

export const useMarkets = (defaultState = MOCK_MARKETS_STATE) => {
  const [state, dispatch] = useReducer(MarketsReducer, defaultState);
  return {
    ...state,
    actions: {
      updateOrderBook: (marketId, orderBook) => dispatch({ type: UPDATE_ORDER_BOOK, marketId, orderBook }),
      clearOrderBook: () => dispatch({ type: CLEAR_ORDER_BOOK })
    },
  };
};
