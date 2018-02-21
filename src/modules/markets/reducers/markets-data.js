import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA, UPDATE_MARKET_CATEGORY, UPDATE_MARKETS_LOADING_STATUS } from 'modules/markets/actions/update-markets-data'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (marketsData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA: // TODO -- allow for the consumption of partial market objects
      return {
        ...marketsData,
        ...processMarketsData(action.marketsData, marketsData)
      }
    case UPDATE_MARKETS_LOADING_STATUS:
      return {
        ...marketsData,
        ...action.marketIds.reduce((p, marketId) => {
          p[marketId] = {
            ...marketsData[marketId],
            isLoading: action.isLoading
          }
          return p
        }, {})
      }
    case UPDATE_MARKET_CATEGORY:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          category: action.category
        }
      }
    case RESET_STATE:
    case CLEAR_MARKETS_DATA:
      return DEFAULT_STATE
    default:
      return marketsData
  }
}

function processMarketsData(newMarketsData, existingMarketsData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      ...newMarketsData[marketId]
    }

    // mark whether details have been loaded
    marketData.hasLoadedMarketInfo = !!marketData.cumulativeScale

    // save market (without outcomes)
    // p[normalizedMarketId] = marketData
    p[marketId] = marketData

    return p
  }, {})
}
