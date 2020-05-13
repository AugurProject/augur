import { Getters } from '@augurproject/sdk';
import { Markets } from '../store/markets';
import { MARKETS_ACTIONS } from '../store/constants';

export const addUpdateMarketInfos = (
  marketsInfo: Getters.Markets.MarketInfo[]
) => {
  const marketInfos = marketsInfo.reduce(
    (p, m) => ({ ...p, [m.id]: m }),
    {}
  );
  Markets.actions.updateMarketsData(marketInfos);
};