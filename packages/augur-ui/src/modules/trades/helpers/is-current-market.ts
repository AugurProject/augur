import { isOnTradePage } from "modules/trades/helpers/is-on-page";
import { getTradePageMarketId } from "modules/trades/helpers/get-trade-page-market-id";
import { AppStatus } from "modules/app/store/app-status";
import { THEMES } from "modules/common/constants";

export const isCurrentMarket = (marketId) => {
  const { theme, accountPositions } = AppStatus.get();
  if (theme === THEMES.SPORTS && accountPositions[marketId]) return true;
  if (!isOnTradePage()) return false;
  if (marketId !== getTradePageMarketId()) return false;
  return true;
};
