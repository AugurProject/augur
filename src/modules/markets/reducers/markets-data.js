import immutableDelete from 'immutable-delete'
import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA, UPDATE_MARKET_CATEGORY, UPDATE_MARKET_REP_BALANCE, UPDATE_MARKET_FROZEN_SHARES_VALUE, UPDATE_MARKET_ESCAPE_HATCH_GAS_COST, UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST, UPDATE_MARKETS_DISPUTE_INFO, REMOVE_MARKET, UPDATE_MARKET_ETH_BALANCE } from 'modules/markets/actions/update-markets-data'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (marketsData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA: // TODO -- allow for the consumption of partial market objects
      return {
        ...marketsData,
        ...processMarketsData(action.marketsData, marketsData),
      }
    case UPDATE_MARKETS_DISPUTE_INFO:
      return {
        ...marketsData,
        ...processMarketsDisputeInfo(action.marketsDisputeInfo, marketsData),
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
    case UPDATE_MARKET_ETH_BALANCE:
      if (!action.marketId) return marketsData
      return {
        ...marketsData,
        [action.marketId]: {
          ...marketsData[action.marketId],
          ethBalance: action.ethBalance,
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
    case REMOVE_MARKET:
      return immutableDelete(marketsData, action.marketId)
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

    p[marketId] = marketData

    return p
  }, {})
}

function processMarketsDisputeInfo(newMarketsDisputeInfo, existingMarketsData) {
  return Object.keys(newMarketsDisputeInfo).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      disputeInfo: { ...newMarketsDisputeInfo[marketId] },
    }

    p[marketId] = marketData

    return p
  }, {})
}
