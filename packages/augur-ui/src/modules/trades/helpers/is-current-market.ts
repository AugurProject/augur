import { isOnTradePage } from "modules/trades/helpers/is-on-page";
import { getTradePageMarketId } from "modules/trades/helpers/get-trade-page-market-id";

export const isCurrentMarket = (marketId) => {
  if (!isOnTradePage()) return false;
  if (marketId !== getTradePageMarketId()) return false;
  return true;
};
