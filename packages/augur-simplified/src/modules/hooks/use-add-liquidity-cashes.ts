import { useAppStatusStore } from "../stores/app-status";
import { Cash, MarketInfo } from "../types";

export const useAddLiquidityCashes = (market: MarketInfo): Cash[] => {
  const { processed: { markets, cashes } } = useAppStatusStore();
  if (market?.amm) {
    return [market.amm.cash];
  }
  const marketId = market.marketId;
  // find all market entries with same marketId and have amm
  const sameMarketCashes = Object.values(markets).filter(m => m.marketId === marketId && Boolean(m.amm)).map(c => c.amm.cash.address);
  // filter out cashes that have amm for this market
  const cashLeft = Object.values(cashes).filter(c => !sameMarketCashes.includes(c.address));
  return cashLeft;
}
