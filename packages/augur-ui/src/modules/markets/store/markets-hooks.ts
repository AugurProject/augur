import { useReducer } from 'react';
import { MARKETS_ACTIONS, MOCK_MARKETS_STATE, DEFAULT_MARKETS_STATE, STUBBED_MARKETS_ACTIONS } from 'modules/markets/store/constants';
import immutableDelete from "immutable-delete";

const {
  UPDATE_ORDER_BOOK,
  CLEAR_ORDER_BOOK,
  UPDATE_MARKETS_DATA,
  REMOVE_MARKET,
  BULK_MARKET_TRADING_HISTORY,
  UPDATE_REPORTING_LIST
} = MARKETS_ACTIONS;

function processMarketsData(newMarketsData, existingMarketsData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      ...newMarketsData[marketId]
    };

    p[marketId] = marketData;

    return p;
  }, {});
}

export const Markets = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MARKETS_STATE }),
  actions: STUBBED_MARKETS_ACTIONS,
};

export function MarketsReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, orderBook } = action;
        if (orderBook || action.payload?.orderBook) {
          updatedState.orderBooks = {
          ...updatedState.orderBooks,
          [marketId]: orderBook || action.payload?.orderBook,
        };
      }
      break;
    }
    case CLEAR_ORDER_BOOK: {
      updatedState.orderBooks = DEFAULT_MARKETS_STATE.orderBooks;
      break;
    }
    case UPDATE_MARKETS_DATA:
      updatedState.marketInfos = {
        ...updatedState.marketInfos,
        ...processMarketsData(action.marketInfos, updatedState.marketInfos)
      };
      break;
    case REMOVE_MARKET:
      updatedState.marketInfos = immutableDelete(updatedState.marketInfos, action.marketId);
      break;
    case BULK_MARKET_TRADING_HISTORY:
      updatedState.marketTradingHistory = {
        ...updatedState.marketTradingHistory,
        ...action.keyedMarketTradingHistory || action.payload.keyedMarketTradingHistory
      };
      break;
    case UPDATE_REPORTING_LIST: 
        const { reportingState, marketIds, params, isLoading } = action;
        updatedState.reportingListState = {
          ...updatedState.reportingListState,
          [reportingState]: {
            marketIds,
            params,
            isLoading,
          }
        };
      break;
    default:
      throw new Error(`Error: ${action.type} not caught by Markets reducer`);
  }

  window.markets = updatedState;
  return updatedState;
}

const isAsync = obj => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    obj.constructor.name === 'AsyncFunction'
  );
}

const middleware = (dispatch, action) => {
  if (isAsync(action.payload)) {
    (async () => {
      const v = await action.payload();
      dispatch({ ...action, payload: v });
    })();
  } else {
    dispatch({...action});
  }
};

export const dispatchMiddleware = (dispatch) => (action) => middleware(dispatch, action);

export const useMarkets = (defaultState = MOCK_MARKETS_STATE) => {
  const [state, dispatch] = useReducer(MarketsReducer, defaultState);
  
  const newDispatch = dispatchMiddleware(dispatch);

  return {
      ...state,
      actions: {
        updateOrderBook: (marketId, orderBook, payload) => newDispatch({ type: UPDATE_ORDER_BOOK, marketId, orderBook, payload}),
        clearOrderBook: () => dispatch({ type: CLEAR_ORDER_BOOK }),
        updateMarketsData: (marketInfos) => dispatch({ type: UPDATE_MARKETS_DATA, marketInfos }),
        removeMarket: (marketId) => dispatch({ type: REMOVE_MARKET, marketId }),
        bulkMarketTradingHistory: (keyedMarketTradingHistory, payload) => newDispatch({ type: BULK_MARKET_TRADING_HISTORY, keyedMarketTradingHistory, payload}),
        updateReportingList: (reportingState, marketIds, params, isLoading) => dispatch({type: UPDATE_REPORTING_LIST, reportingState, marketIds, params, isLoading})
      },
    };
};
