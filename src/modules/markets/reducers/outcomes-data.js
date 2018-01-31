import { UPDATE_MARKETS_DATA } from 'modules/markets/actions/update-markets-data'
import { UPDATE_OUTCOME_PRICE } from 'modules/markets/actions/update-outcome-price'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { BINARY_YES_ID, SCALAR_UP_ID, BINARY_NO_OUTCOME_NAME, BINARY_YES_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

const DEFAULT_STATE = {}

export default function (outcomesData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA:
      return {
        ...outcomesData,
        ...parseOutcomes(action.marketsData, outcomesData)
      }
    case UPDATE_OUTCOME_PRICE:
      if (!outcomesData || !outcomesData[action.marketID] || !outcomesData[action.marketID][action.outcomeID]) {
        return outcomesData
      }
      return {
        ...outcomesData,
        [action.marketID]: {
          ...outcomesData[action.marketID],
          [action.outcomeID]: {
            ...outcomesData[action.marketID][action.outcomeID],
            price: action.price
          }
        }
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return outcomesData
  }
}

function parseOutcomes(newMarketsData, outcomesData) {
  return Object.keys(newMarketsData).reduce((p, marketID) => {
    const marketData = newMarketsData[marketID]

    if (!marketData.marketType || !marketData.outcomes || !marketData.outcomes.length) {
      return p
    }

    switch (marketData.marketType) {
      case BINARY:
        p[marketID] = {
          ...outcomesData[marketID],
          ...parseBinaryOutcomes(marketData)
        }
        return p

      case CATEGORICAL:
        p[marketID] = {
          ...outcomesData[marketID],
          ...parseCategoricalOutcomes(marketData, marketID)
        }
        return p

      case SCALAR:
        p[marketID] = {
          ...outcomesData[marketID],
          ...parseScalarOutcomes(marketData, marketID)
        }
        return p

      default:
        console.warn('Unknown market type:', marketID, marketData.marketType, marketData)
        return p
    }
  }, {})

  function parseBinaryOutcomes(marketData, marketID) {
    return marketData.outcomes.reduce((p, outcome) => {
      p[outcome.id] = { ...outcome }
      p[outcome.id].name = outcome.id === BINARY_YES_ID ? BINARY_YES_OUTCOME_NAME : BINARY_NO_OUTCOME_NAME
      return p
    }, {})
  }

  function parseCategoricalOutcomes(marketData, marketID) {
    return marketData.outcomes.reduce((p, outcome, i) => {
      p[outcome.id] = { ...outcome }
      p[outcome.id].name = outcome.description.toString().trim()
      delete p[outcome.id].id
      return p
    }, {})
  }

  function parseScalarOutcomes(marketData, marketID) {
    return marketData.outcomes.reduce((p, outcome) => {
      if (outcome.id !== SCALAR_UP_ID) return p
      p[outcome.id] = { ...outcome }
      p[outcome.id].name = ''
      return p
    }, {})
  }
}
