import speedomatic from 'speedomatic'
import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA, UPDATE_MARKETS_LOADING_STATUS, UPDATE_MARKET_TOPIC } from 'modules/markets/actions/update-markets-data'
import { CATEGORICAL, BINARY } from 'modules/markets/constants/market-types'
import { CATEGORICAL_OUTCOMES_SEPARATOR } from 'modules/markets/constants/market-outcomes'

export default function (marketsData = {}, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA:
      return {
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

  // it's important to loop through the original marketIDs so that unloaded markets can still be marked as isLoadedMarketInfo and avoid infinite recursion later on
  return Object.keys(newMarketsData).reduce((p, marketID) => {
    const normalizedMarketID = speedomatic.formatInt256(marketID)

    const marketData = {
      ...existingMarketsData[normalizedMarketID],
      ...newMarketsData[marketID]
    }

    // clean description
    if (marketData.type === CATEGORICAL) {
      marketData.description = marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR).slice(0, -1).join()
    }
    if (marketData.type === BINARY) {
      const splitDescription = marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR)
      if (splitDescription.length === 2) {
        marketData.description = splitDescription.slice(0, -1).join()
      }
    }

    // mark whether details have been loaded
    marketData.isLoadedMarketInfo = !!marketData.cumulativeScale

    // save market (without outcomes)
    p[normalizedMarketID] = marketData

    return p
  }, {})
}
