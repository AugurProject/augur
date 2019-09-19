import {
  YES_NO,
  CATEGORICAL,
  YES_NO_YES_OUTCOME_NAME,
  YES_NO_YES_ID,
} from 'modules/common/constants';
import { MarketData } from 'modules/types';

export const getOutcomeName = (
  market: MarketData,
  outcomeId: number,
  alwaysReturnYesForBinaryMarket: boolean = true
): string => {
  // default to handle app loading
  if (!market) return YES_NO_YES_OUTCOME_NAME;
  const { marketType } = market;
  // default to handle app loading
  if (!marketType) return YES_NO_YES_OUTCOME_NAME;

  switch (marketType) {
    case YES_NO: {
      if (!alwaysReturnYesForBinaryMarket && outcomeId === YES_NO_YES_ID) {
        return 'No';
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
      return market.scalarDenomination || 'N/A';
    }
  }
};

export const getOutcomeNameWithOutcome = (
  market: MarketData,
  outcomeId: string,
  alwaysReturnYesForBinaryMarket: boolean = true
): string => {
  if (!outcomeId || outcomeId === undefined)
    throw new Error(`${outcomeId} isn't defined`);
  let id = parseInt(outcomeId, 10);
  if (isNaN(id)) {
    throw new Error(`${id} is not a valid outcome id`);
  }
  return getOutcomeName(market, id, alwaysReturnYesForBinaryMarket);
};
