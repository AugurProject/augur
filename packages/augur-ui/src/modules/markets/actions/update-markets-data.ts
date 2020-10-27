import { MarketInfo } from '@augurproject/sdk-lite';

export const addUpdateMarketInfos = (
  marketsInfo: MarketInfo[]
) => {
  const marketInfos = marketsInfo.reduce(
    (p, m) => ({ ...p, [m.id]: m }),
    {}
  );
  return marketInfos;
};