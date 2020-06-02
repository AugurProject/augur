import { getLastTradeTimestamp } from "modules/portfolio/helpers/get-last-trade-timestamp";
import { Markets } from "modules/markets/store/markets";
import { AppStatus } from "modules/app/store/app-status";

export default function() {
  return marketsPositionsRecentlyTraded();
}

export const marketsPositionsRecentlyTraded = () => {
  const { accountPositions } = AppStatus.get();
  const { marketTradingHistory } = Markets.get();
  return Object.keys(accountPositions).reduce(
    (p, m) => ({ ...p, [m]: getLastTradeTimestamp(marketTradingHistory[m]) }),
    {},
  ),
};