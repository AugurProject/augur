import {
  YES_NO,
  CATEGORICAL,
  YES_NO_YES_OUTCOME_NAME
} from "modules/common-elements/constants";

export const getOutcomeName = (
  market,
  outcome,
  alwaysReturnYesForBinaryMarket = true
) => {
  // default to handle app loading
  if (!market) return YES_NO_YES_OUTCOME_NAME;
  const { marketType } = market;
  // default to handle app loading
  if (!marketType) return YES_NO_YES_OUTCOME_NAME;
  switch (marketType) {
    case YES_NO: {
      if (!alwaysReturnYesForBinaryMarket && outcome.toString() === "0") {
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
