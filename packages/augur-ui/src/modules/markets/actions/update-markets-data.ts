export const UPDATE_MARKETS_DATA = "UPDATE_MARKETS_DATA";
export const CLEAR_MARKETS_DATA = "CLEAR_MARKETS_DATA";
export const UPDATE_MARKET_CATEGORY = "UPDATE_MARKET_CATEGORY";
export const UPDATE_MARKET_REP_BALANCE = "UPDATE_MARKET_REP_BALANCE";
export const UPDATE_MARKET_FROZEN_SHARES_VALUE =
  "UPDATE_MARKET_FROZEN_SHARES_VALUE";
export const UPDATE_MARKETS_DISPUTE_INFO = "UPDATE_MARKETS_DISPUTE_INFO";
export const UPDATE_MARKET_ETH_BALANCE = "UPDATE_MARKET_ETH_BALANCE";
export const REMOVE_MARKET = "REMOVE_MARKET";

export const updateMarketsData = (marketsData: any) => ({
  type: UPDATE_MARKETS_DATA,
  data: { marketsData }
});
export const clearMarketsData = () => ({ type: CLEAR_MARKETS_DATA });
export const updateMarketCategory = (marketId: string, category: string) => ({
  type: UPDATE_MARKET_CATEGORY,
  data: {
    marketId,
    category
  }
});
export const updateMarketRepBalance = (
  marketId: string,
  repBalance: string
) => ({
  type: UPDATE_MARKET_REP_BALANCE,
  data: {
    marketId,
    repBalance
  }
});
export const updateMarketFrozenSharesValue = (
  marketId: string,
  frozenSharesValue: string
) => ({
  type: UPDATE_MARKET_FROZEN_SHARES_VALUE,
  data: {
    marketId,
    frozenSharesValue
  }
});
export const updateMarketsDisputeInfo = (marketsDisputeInfo: any) => ({
  type: UPDATE_MARKETS_DISPUTE_INFO,
  data: { marketsDisputeInfo }
});
export const updateMarketEthBalance = (
  marketId: string,
  ethBalance: string
) => ({
  type: UPDATE_MARKET_ETH_BALANCE,
  data: {
    marketId,
    ethBalance
  }
});
export const removeMarket = (marketId: string) => ({
  type: REMOVE_MARKET,
  data: { marketId }
});
