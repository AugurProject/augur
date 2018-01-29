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
        ...action.marketIDs.reduce((p, marketID) => {
          p[marketID] = {
            ...marketsData[marketID],
            isLoading: action.isLoading
          }
          return p
        }, {})
      }
    case UPDATE_MARKET_CATEGORY:
      if (!action.marketID) return marketsData
      return {
        ...marketsData,
        [action.marketID]: {
          ...marketsData[action.marketID],
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
