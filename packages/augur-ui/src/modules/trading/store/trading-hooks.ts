import { useReducer, useMemo } from 'react';
import {
  DEFAULT_TRADING,
  TRADING_ACTIONS,
  FORM_INPUT_TYPES as TYPES,
} from 'modules/trading/store/constants';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import { orderValidation } from 'modules/trading/helpers/form-helpers';

const {
  UPDATE_AND_VALIDATE,
} = TRADING_ACTIONS;

export function TradingReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    default:
      console.error(`Error: ${action.type} not caught by Trading reducer.`);
  }
  window.trading = updatedState;
  return updatedState;
}

const getDefaultTrade = ({
  market: {
    id,
    settlementFee,
    marketType,
    maxPrice,
    minPrice,
    cumulativeScale,
    makerFee,
  },
  selectedOutcome,
}) => {
  if (!marketType || !selectedOutcome?.id) return null;
  return generateTrade(
    {
      id,
      settlementFee,
      marketType,
      maxPrice,
      minPrice,
      cumulativeScale,
      makerFee,
    },
    {}
  );
};

const handleSelectedOutcome = (market, selectedOutcomeId) => {
  const selectedOutcome = useMemo(
    () => market.outcomesFormatted.find(({ id }) => id === selectedOutcomeId),
    [selectedOutcomeId, market]
  );
  const defaultState = calculateDefaultState(market, selectedOutcome);
  return { defaultState, selectedOutcome };
};

const calculateDefaultState = (market, selectedOutcome) => ({
  ...DEFAULT_TRADING,
  [TYPES.TRADE]: getDefaultTrade({ market, selectedOutcome }),
});

export const useTrading = (market, selectedOutcomeId) => {
  const { defaultState, selectedOutcome } = handleSelectedOutcome(
    market,
    selectedOutcomeId
  );
  const [state, dispatch] = useReducer(TradingReducer, defaultState);
  return {
    ...state,
    actions: {
      updateandValidate: (key, value) => {
        const newOrderInfo = {
          ...state,
          [key]: value,
        };
        const { isOrderValid, errors, errorCount } = orderValidation(
          newOrderInfo,
          undefined,
          nextProps,
          state.confirmationTimeEstimation,
          true
        );
        const updates = {
          ...newOrderInfo,
          isOrderValid,
          errors,
          errorCount,
        }
        dispatch({ type: UPDATE_AND_VALIDATE, updates })
      },
    },
  };
};
