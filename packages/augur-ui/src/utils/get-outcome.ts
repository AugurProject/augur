import {
  YES_NO,
  CATEGORICAL,
  YES_NO_YES_OUTCOME_NAME,
} from "modules/common-elements/constants";
import { MarketData, Outcomes } from "modules/types";

export const getOutcomeName = (
  market: MarketData,
  outcome: Outcomes,
  alwaysReturnYesForBinaryMarket: boolean = true,
): string => {
  // default to handle app loading
  if (!market) return YES_NO_YES_OUTCOME_NAME;
  const { marketType } = market;
  // default to handle app loading
  if (!marketType) return YES_NO_YES_OUTCOME_NAME;
  switch (marketType) {
    case YES_NO: {
      if (!alwaysReturnYesForBinaryMarket && outcome.id.toString() === "0") {
        return "No";
      }
      return YES_NO_YES_OUTCOME_NAME;
    }
    case CATEGORICAL: {
      return outcome.description || "N/A";
    }
    default: {
      return market.scalarDenomination || "N/A";
    }
  }
};
