import { UPDATE_MARKETS_DATA } from "modules/markets/actions/update-markets-data";
import { UPDATE_OUTCOME_PRICE } from "modules/markets/actions/update-outcome-price";
import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  YES_NO,
  CATEGORICAL,
  SCALAR,
  SCALAR_DOWN_ID,
  YES_NO_NO_ID
} from "modules/common/constants";
import { OutcomesData, BaseAction } from "modules/types";

const DEFAULT_STATE: OutcomesData = {};

export default function(
  outcomesData: OutcomesData = DEFAULT_STATE,
  {type, data}: BaseAction,
): OutcomesData {
  switch (type) {
    case UPDATE_MARKETS_DATA:
      return {
        ...outcomesData,
        ...parseOutcomes(data.marketsData, outcomesData),
      };
    case UPDATE_OUTCOME_PRICE: {
      const { marketId, outcomeId, price } = data;
      if (
        !outcomesData ||
        !outcomesData[marketId] ||
        !outcomesData[marketId][outcomeId]
      ) {
        return outcomesData;
      }
      return {
        ...outcomesData,
        [marketId]: {
          ...outcomesData[marketId],
          [outcomeId]: {
            ...outcomesData[marketId][outcomeId],
            price
          }
        }
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return outcomesData;
  }
}

function parseOutcomes(newMarketsData, outcomesData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = newMarketsData[marketId];

    if (
      !marketData.marketType ||
      !marketData.outcomes ||
      !marketData.outcomes.length
    ) {
      return p;
    }

    switch (marketData.marketType) {
      case YES_NO:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseYesNoScalarOutcomes(marketData)
        };
        return p;

      case CATEGORICAL:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseCategoricalOutcomes(marketData)
        };
        return p;

      case SCALAR:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseYesNoScalarOutcomes(marketData)
        };
        return p;

      default:
        console.warn(
          "Unknown market type:",
          marketId,
          marketData.marketType,
          marketData
        );
        return p;
    }
  }, {});

  function parseYesNoScalarOutcomes(marketData) {
    return marketData.outcomes.reduce((p, outcome) => {
      if (outcome.id !== YES_NO_NO_ID) {
        p[outcome.id] = { ...outcome };
        p[outcome.id].name = outcome.description
        return p;
      }

      return p;
    }, {});
  }

  // TODO: remove this when refactoring out outcome `name` and using description
  function parseCategoricalOutcomes(marketData) {
    return marketData.outcomes.reduce((p, outcome) => {
      p[outcome.id] = { ...outcome };
      p[outcome.id].name = outcome.description.toString().trim();
      delete p[outcome.id].id;
      return p;
    }, {});
  }
}
