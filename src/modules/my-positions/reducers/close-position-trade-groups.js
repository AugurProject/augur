import { ADD_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/add-close-position-trade-group';
import { CLEAR_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/clear-close-position-trade-group';

export default function (closePositionTradeGroups = {}, action) {
  switch (action.type) {
    case ADD_CLOSE_POSITION_TRADE_GROUP: {
      const oldTradeGroups = (closePositionTradeGroups[action.marketID] && closePositionTradeGroups[action.marketID][action.outcomeID]) || [];
      const updatedTradeGroups = [...oldTradeGroups, action.tradeGroupID];

      return {
        [action.marketID]: {
          ...closePositionTradeGroups[action.marketID],
          [action.outcomeID]: updatedTradeGroups
        }
      };
    }
    case CLEAR_CLOSE_POSITION_TRADE_GROUP: {
      const updatedOutcomes = Object.keys(closePositionTradeGroups[action.marketID] || {}).reduce((p, outcomeID) => {
        if (outcomeID !== action.outcomeID) {
          return { ...p, [outcomeID]: closePositionTradeGroups[action.marketID][outcomeID] };
        }

        return p;
      }, {});

      return {
        [action.marketID]: {
          ...updatedOutcomes
        }
      };
    }
    default:
      return closePositionTradeGroups;
  }
}
