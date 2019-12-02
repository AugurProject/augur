import {
  YES_NO,
  CATEGORICAL,
  YES_NO_YES_OUTCOME_NAME,
  YES_NO_YES_ID,
  YES_NO_NO_OUTCOME_NAME,
  INVALID_OUTCOME_ID
} from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { INVALID_OUTCOME } from 'modules/create-market/constants';
import { MarketInfo } from '@augurproject/sdk/src/state/getter/Markets';

const getOutcomeName = (
  market: MarketData | MarketInfo,
  outcomeId: number,
  isInvalid: boolean = false,
  showScalarOutcome: boolean = false
): string => {
  // default to handle app loading
  if (!market) return YES_NO_YES_OUTCOME_NAME;
  const { marketType } = market;
  // default to handle app loading
  if (!marketType) return YES_NO_YES_OUTCOME_NAME;

  if (outcomeId === INVALID_OUTCOME_ID || isInvalid) return INVALID_OUTCOME;

  switch (marketType) {
    case YES_NO: {
      if (outcomeId !== YES_NO_YES_ID) {
        return YES_NO_NO_OUTCOME_NAME;
      }
      return YES_NO_YES_OUTCOME_NAME;
    }
    case CATEGORICAL: {
      let description = market.outcomes.find(
        mOutcome => mOutcome.id === outcomeId
      ).description;
      return description || 'N/A';
    }
    default: {
      const denomination = market.scalarDenomination || 'N/A';
      return showScalarOutcome ? `${outcomeId} ${denomination}` : denomination;
    }
  }
};

export const getOutcomeNameWithOutcome = (
  market: MarketData | MarketInfo,
  outcomeId: string,
  isInvalid: boolean = false,
  showScalarOutcome: boolean = false
): string => {
  if (!outcomeId || outcomeId === undefined)
    throw new Error(`${outcomeId} isn't defined`);
  let id = parseInt(outcomeId, 10);
  if (isNaN(id)) {
    throw new Error(`${id} is not a valid outcome id`);
  }
  return getOutcomeName(market, id, isInvalid, showScalarOutcome);
};
