import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA, UPDATE_MARKET_CATEGORY, UPDATE_MARKETS_LOADING_STATUS, UPDATE_MARKET_REP_BALANCE, UPDATE_MARKET_FROZEN_SHARES_VALUE, UPDATE_MARKET_ESCAPE_HATCH_GAS_COST, UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST } from 'modules/markets/actions/update-markets-data'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (marketsData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA: // TODO -- allow for the consumption of partial market objects
      return {
        ...marketsData,
        ...processMarketsData(action.marketsData, marketsData),
      }
    case UPDATE_MARKETS_LOADING_STATUS:
      return {
        ...marketsData,
        ...action.marketIds.reduce((p, marketId) => {
          p[marketId] = {
            ...marketsData[marketId],
            isLoading: action.isLoading,
          }
          return p
        }, {}),
      }
    case UPDATE_MARKET_CATEGORY:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          category: action.category,
        },
      }
    case UPDATE_MARKET_REP_BALANCE:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          repBalance: action.repBalance,
        },
      }
    case UPDATE_MARKET_FROZEN_SHARES_VALUE:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          frozenSharesValue: action.frozenSharesValue,
        },
      }
    case UPDATE_MARKET_ESCAPE_HATCH_GAS_COST:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          escapeHatchGasCost: action.escapeHatchGasCost,
        },
      }
    case UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          tradingEscapeHatchGasCost: action.tradingEscapeHatchGasCost,
        },
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
      ...newMarketsData[marketId],
    }

    // mark whether details have been loaded
    marketData.hasLoadedMarketInfo = !!marketData.cumulativeScale

    // save market (without outcomes)
    // p[normalizedmarketId] = marketData
    p[marketId] = marketData

    return p
  }, {})
}
