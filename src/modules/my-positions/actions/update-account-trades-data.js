export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA'
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA'

export const updateAccountPositionsData = (data, marketId) => ({ type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketId })
export const updateAccountTradeData = (data, market) => ({ type: UPDATE_ACCOUNT_TRADES_DATA, data, market })
