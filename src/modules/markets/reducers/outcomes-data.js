import { UPDATE_MARKETS_DATA } from 'modules/markets/actions/update-markets-data'
import { UPDATE_OUTCOME_PRICE } from 'modules/markets/actions/update-outcome-price'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { YES_NO_YES_ID, SCALAR_UP_ID, YES_NO_YES_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

const DEFAULT_STATE = {}

export default function (outcomesData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA:
      return {
        ...outcomesData,
        ...parseOutcomes(action.marketsData, outcomesData),
      }
    case UPDATE_OUTCOME_PRICE:
      if (!outcomesData || !outcomesData[action.marketId] || !outcomesData[action.marketId][action.outcomeId]) {
        return outcomesData
      }
      return {
        ...outcomesData,
        [action.marketId]: {
          ...outcomesData[action.marketId],
          [action.outcomeId]: {
            ...outcomesData[action.marketId][action.outcomeId],
            price: action.price,
          },
        },
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return outcomesData
  }
}

function parseOutcomes(newMarketsData, outcomesData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = newMarketsData[marketId]

    if (!marketData.marketType || !marketData.outcomes || !marketData.outcomes.length) {
      return p
    }

    switch (marketData.marketType) {
      case YES_NO:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseYesNoOutcomes(marketData),
        }
        return p

      case CATEGORICAL:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseCategoricalOutcomes(marketData, marketId),
        }
        return p

      case SCALAR:
        p[marketId] = {
          ...outcomesData[marketId],
          ...parseScalarOutcomes(marketData, marketId),
        }
        return p

      default:
        console.warn('Unknown market type:', marketId, marketData.marketType, marketData)
        return p
    }
  }, {})

  function parseYesNoOutcomes(marketData, marketId) {
    return marketData.outcomes.reduce((p, outcome, i) => {
      if (outcome.id === YES_NO_YES_ID) {
        p[outcome.id] = { ...outcome }
        p[outcome.id].name = YES_NO_YES_OUTCOME_NAME
        return p
      }

      return p
    }, {})
  }

  function parseCategoricalOutcomes(marketData, marketId) {
    return marketData.outcomes.reduce((p, outcome, i) => {
      p[outcome.id] = { ...outcome }
      p[outcome.id].name = outcome.description.toString().trim()
      delete p[outcome.id].id
      return p
    }, {})
  }

  function parseScalarOutcomes(marketData, marketId) {
    return marketData.outcomes.reduce((p, outcome) => {
      if (outcome.id !== SCALAR_UP_ID) return p
      p[outcome.id] = { ...outcome }
      p[outcome.id].name = ''
      return p
    }, {})
  }
}
