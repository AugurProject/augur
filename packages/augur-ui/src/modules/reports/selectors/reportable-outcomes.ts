import {
  YES_NO_NO_ID,
  YES_NO_NO_OUTCOME_NAME,
  YES_NO_YES_ID,
  YES_NO_YES_OUTCOME_NAME,
} from "modules/common/constants";
import { MarketType } from "@augurproject/sdk/build/state/logs/types";

export const selectReportableOutcomes = (type: MarketType, outcomes) => {
  switch (type) {
    case MarketType.YesNo:
      return [
        {
          id: `${YES_NO_NO_ID}`,
          name: YES_NO_NO_OUTCOME_NAME
        },
        {
          id: `${YES_NO_YES_ID}`,
          name: YES_NO_YES_OUTCOME_NAME
        }
      ];
    case MarketType.Categorical:
      return outcomes.slice();
    default:
      return [];
  }
};
