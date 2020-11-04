import { MarketInfo } from '@augurproject/sdk-lite';
import {
  YES_NO,
  CATEGORICAL,
  YES_NO_YES_OUTCOME_NAME,
  YES_NO_YES_ID,
  YES_NO_NO_OUTCOME_NAME,
  INVALID_OUTCOME_ID,
  SCALAR,
  INVALID_OUTCOME_LABEL
} from 'modules/common/constants';
import { MarketData } from 'modules/types';

const getOutcomeName = (
  { marketType, scalarDenomination, outcomes }: MarketData,
  outcomeId: number,
  isInvalid: boolean = false,
  showScalarOutcome: boolean = false
): string => {
  // default to handle app loading
  if (!marketType) return YES_NO_YES_OUTCOME_NAME;

  if ((marketType !== SCALAR && outcomeId === INVALID_OUTCOME_ID) || isInvalid) return INVALID_OUTCOME_LABEL;

  switch (marketType) {
    case YES_NO: {
      if (outcomeId !== YES_NO_YES_ID) {
        return YES_NO_NO_OUTCOME_NAME;
      }
      return YES_NO_YES_OUTCOME_NAME;
    }
    case CATEGORICAL: {
      let description = outcomes.find(
        mOutcome => mOutcome.id === outcomeId
      ).description;
      return description || 'N/A';
    }
    default: {
      const denomination = scalarDenomination || 'N/A';
      return showScalarOutcome ? `${outcomeId} ${denomination}` : denomination;
    }
  }
};

export const getOutcomeNameWithOutcome = (
  market: MarketData,
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
