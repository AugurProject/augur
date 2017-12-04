import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA, UPDATE_MARKET_TOPIC, UPDATE_MARKETS_LOADING_STATUS } from 'modules/markets/actions/update-markets-data'
import { CATEGORICAL, BINARY } from 'modules/markets/constants/market-types'
import { CATEGORICAL_OUTCOMES_SEPARATOR } from 'modules/markets/constants/market-outcomes'

export default function (marketsData = {}, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA:
      return {
        ...marketsData,
        ...processMarketsData(action.marketsData, marketsData)
      }
    case UPDATE_MARKETS_LOADING_STATUS:
      return {
        ...marketsData,
        ...action.marketIDs.reduce((p, marketID) => {
          p[marketID] = {
            ...marketsData[marketID],
            isLoading: action.isLoading
          }
          return p
        }, {})
      }
    case UPDATE_MARKET_TOPIC:
      if (!action.marketID) return marketsData
      return {
        ...marketsData,
        [action.marketID]: {
          ...marketsData[action.marketID],
          topic: action.topic
        }
      }
    case CLEAR_MARKETS_DATA:
      return {}
    default:
      return marketsData
  }
}

function processMarketsData(newMarketsData, existingMarketsData) {
  return Object.keys(newMarketsData).reduce((p, marketID) => {
    const marketData = {
      ...existingMarketsData[marketID],
      ...newMarketsData[marketID]
    }

    // mark whether details have been loaded
    marketData.hasLoadedMarketInfo = !!marketData.cumulativeScale

    // save market (without outcomes)
    // p[normalizedMarketID] = marketData
    p[marketID] = marketData

    return p
  }, {})
}
