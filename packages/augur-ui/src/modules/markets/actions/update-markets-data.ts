import { Getters } from '@augurproject/sdk';
import { Markets } from '../store/markets';

export const addUpdateMarketInfos = (
  marketsInfo: Getters.Markets.MarketInfo[]
) => {
  const marketInfos = marketsInfo.reduce(
    (p, m) => ({ ...p, [m.id]: m }),
    {}
  );
  Markets.actions.updateMarketsData(marketInfos);
};