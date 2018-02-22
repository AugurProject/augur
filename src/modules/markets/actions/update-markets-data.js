export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA'
export const CLEAR_MARKETS_DATA = 'CLEAR_MARKETS_DATA'
export const UPDATE_MARKETS_LOADING_STATUS = 'UPDATE_MARKETS_LOADING_STATUS'
export const UPDATE_MARKET_CATEGORY = 'UPDATE_MARKET_CATEGORY'
export const UPDATE_MARKET_REP_BALANCE = 'UPDATE_MARKET_REP_BALANCE'
export const UPDATE_MARKET_FROZEN_SHARES_VALUE = 'UPDATE_MARKET_FROZEN_SHARES_VALUE'
export const UPDATE_MARKET_ESCAPE_HATCH_GAS_COST = 'UPDATE_MARKET_ESCAPE_HATCH_GAS_COST'
export const UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST = 'UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST'

export const updateMarketsData = marketsData => ({ type: UPDATE_MARKETS_DATA, marketsData })
export const clearMarketsData = () => ({ type: CLEAR_MARKETS_DATA })
export const updateMarketsLoadingStatus = (marketIds, isLoading) => ({ type: UPDATE_MARKETS_LOADING_STATUS, marketIds, isLoading })
export const updateMarketCategory = (marketId, category) => ({ type: UPDATE_MARKET_CATEGORY, marketId, category })
export const updateMarketRepBalance = (marketId, repBalance) => ({ type: UPDATE_MARKET_REP_BALANCE, marketId, repBalance })
export const updateMarketFrozenSharesValue = (marketId, frozenSharesValue) => ({ type: UPDATE_MARKET_FROZEN_SHARES_VALUE, marketId, frozenSharesValue })
export const updateMarketEscapeHatchGasCost = (marketId, escapeHatchGasCost) => ({ type: UPDATE_MARKET_ESCAPE_HATCH_GAS_COST, marketId, escapeHatchGasCost })
export const updateMarketTradingEscapeHatchGasCost = (marketId, tradingEscapeHatchGasCost) => ({ type: UPDATE_MARKET_TRADING_ESCAPE_HATCH_GAS_COST, marketId, tradingEscapeHatchGasCost })
