import { selectMarket } from "modules/markets/selectors/market";
import { Markets } from "../store/markets";

export default function() {
  return selectMarkets();
}

export const getMarkets = () => {
  const { marketInfos } = Markets.get();
  if (!marketInfos) return [];
  return Object.keys(marketInfos).reduce((p, marketId) => {
    if (!marketId || !marketInfos[marketId]) return p;
    return [...p, selectMarket(marketId)];
  }, []);
};

export const selectMarkets = () => {
      const { marketInfos } = Markets.get();
      if (!marketInfos) return [];
      return Object.keys(marketInfos).reduce((p, marketId) => {
        if (!marketId || !marketInfos[marketId]) return p;
        return [...p, selectMarket(marketId)];
      }, []);
    }