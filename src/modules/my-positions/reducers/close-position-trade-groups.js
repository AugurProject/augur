import { ADD_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/add-close-position-trade-group'
import { CLEAR_CLOSE_POSITION_OUTCOME } from 'modules/my-positions/actions/clear-close-position-outcome'

export default function (closePositionTradeGroups = {}, action) {
  switch (action.type) {
    case ADD_CLOSE_POSITION_TRADE_GROUP: {
      const oldTradeGroups = (closePositionTradeGroups[action.marketID] && closePositionTradeGroups[action.marketID][action.outcomeID]) || []
      const updatedTradeGroups = [...oldTradeGroups, action.tradeGroupID]

      return {
        ...closePositionTradeGroups,
        [action.marketID]: {
          ...closePositionTradeGroups[action.marketID],
          [action.outcomeID]: updatedTradeGroups
        }
      }
    }
    case CLEAR_CLOSE_POSITION_OUTCOME: {
      const updatedOutcomes = Object.keys(closePositionTradeGroups[action.marketID] || {}).reduce((p, outcomeID) => {
        if (outcomeID !== action.outcomeID) {
          return { ...p, [outcomeID]: closePositionTradeGroups[action.marketID][outcomeID] }
        }

        return p
      }, {})

      let updatedClosePositionTradeGroups

      if (Object.keys(updatedOutcomes).length) {
        updatedClosePositionTradeGroups = {
          ...closePositionTradeGroups,
          [action.marketID]: updatedOutcomes
        }
      } else {
        updatedClosePositionTradeGroups = Object.keys(closePositionTradeGroups).reduce((p, marketID) => {
          if (marketID !== action.marketID) {
            return { ...p, [marketID]: closePositionTradeGroups[marketID] }
          }

          return p
        }, {})
      }

      return updatedClosePositionTradeGroups
    }
    default:
      return closePositionTradeGroups
  }
}
