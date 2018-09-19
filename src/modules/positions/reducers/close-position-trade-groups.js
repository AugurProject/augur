import {
  ADD_CLOSE_POSITION_TRADE_GROUP,
  REMOVE_CLOSE_POSITION_TRADE_GROUP
} from "modules/positions/actions/add-close-position-trade-group";
import { CLEAR_CLOSE_POSITION_OUTCOME } from "modules/positions/actions/clear-close-position-outcome";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(
  closePositionTradeGroups = DEFAULT_STATE,
  { type, data }
) {
  switch (type) {
    case ADD_CLOSE_POSITION_TRADE_GROUP: {
      const { marketId, outcomeId, tradeGroupId } = data;
      const oldTradeGroups =
        (closePositionTradeGroups[marketId] &&
          closePositionTradeGroups[marketId][outcomeId]) ||
        [];
      const updatedTradeGroups = [...oldTradeGroups, tradeGroupId];

      return {
        ...closePositionTradeGroups,
        [marketId]: {
          ...closePositionTradeGroups[marketId],
          [outcomeId]: updatedTradeGroups
        }
      };
    }
    case REMOVE_CLOSE_POSITION_TRADE_GROUP: {
      const { marketId, outcomeId } = data;
      return Object.keys(closePositionTradeGroups[marketId] || {}).reduce(
        (p, curOutcomeId) => {
          if (curOutcomeId !== outcomeId) {
            return {
              ...p,
              [marketId]: {
                [curOutcomeId]: closePositionTradeGroups[marketId][curOutcomeId]
              }
            };
          }

          return p;
        },
        {}
      );
    }
    case CLEAR_CLOSE_POSITION_OUTCOME: {
      const { marketId, outcomeId } = data;
      const updatedOutcomes = Object.keys(
        closePositionTradeGroups[marketId] || {}
      ).reduce((p, curOutcomeId) => {
        if (parseInt(curOutcomeId, 10) !== outcomeId) {
          return {
            ...p,
            [curOutcomeId]: closePositionTradeGroups[marketId][curOutcomeId]
          };
        }

        return p;
      }, {});

      let updatedClosePositionTradeGroups;

      if (Object.keys(updatedOutcomes).length) {
        updatedClosePositionTradeGroups = {
          ...closePositionTradeGroups,
          [marketId]: updatedOutcomes
        };
      } else {
        updatedClosePositionTradeGroups = Object.keys(
          closePositionTradeGroups
        ).reduce((p, curMarketId) => {
          if (curMarketId !== marketId) {
            return {
              ...p,
              [curMarketId]: closePositionTradeGroups[curMarketId]
            };
          }

          return p;
        }, {});
      }

      return updatedClosePositionTradeGroups;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return closePositionTradeGroups;
  }
}
