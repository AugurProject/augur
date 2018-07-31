import { ADD_CLOSE_POSITION_TRADE_GROUP, REMOVE_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/add-close-position-trade-group'
import { CLEAR_CLOSE_POSITION_OUTCOME } from 'modules/my-positions/actions/clear-close-position-outcome'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (closePositionTradeGroups = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_CLOSE_POSITION_TRADE_GROUP: {
      const oldTradeGroups = (closePositionTradeGroups[action.marketId] && closePositionTradeGroups[action.marketId][action.outcomeId]) || []
      const updatedTradeGroups = [...oldTradeGroups, action.tradeGroupId]

      return {
        ...closePositionTradeGroups,
        [action.marketId]: {
          ...closePositionTradeGroups[action.marketId],
          [action.outcomeId]: updatedTradeGroups,
        },
      }
    }
    case REMOVE_CLOSE_POSITION_TRADE_GROUP: {
      return Object.keys(closePositionTradeGroups[action.marketId] || {}).reduce((p, outcomeId) => {
        if (outcomeId !== action.outcomeId) {
          return {
            ...p,
            [action.marketId]: {
              [outcomeId]: closePositionTradeGroups[action.marketId][outcomeId],
            },
          }
        }

        return p
      }, {})
    }
    case CLEAR_CLOSE_POSITION_OUTCOME: {
      const updatedOutcomes = Object.keys(closePositionTradeGroups[action.marketId] || {}).reduce((p, outcomeId) => {
        if (parseInt(outcomeId, 10) !== action.outcomeId) {
          return { ...p, [outcomeId]: closePositionTradeGroups[action.marketId][outcomeId] }
        }

        return p
      }, {})

      let updatedClosePositionTradeGroups

      if (Object.keys(updatedOutcomes).length) {
        updatedClosePositionTradeGroups = {
          ...closePositionTradeGroups,
          [action.marketId]: updatedOutcomes,
        }
      } else {
        updatedClosePositionTradeGroups = Object.keys(closePositionTradeGroups).reduce((p, marketId) => {
          if (marketId !== action.marketId) {
            return { ...p, [marketId]: closePositionTradeGroups[marketId] }
          }

          return p
        }, {})
      }

      return updatedClosePositionTradeGroups
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return closePositionTradeGroups
  }
}
