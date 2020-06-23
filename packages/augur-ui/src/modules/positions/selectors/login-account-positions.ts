import { selectMarket } from 'modules/markets/selectors/market';
import { selectMarketPositionsSummary } from 'modules/markets/selectors/select-market-position-summary';
import { selectUserMarketPositions } from 'modules/markets/selectors/select-user-market-positions';
import { MarketData } from 'modules/types';
import { Markets } from 'modules/markets/store/markets';
import { AppStatus } from 'modules/app/store/app-status';

export default function() {
  const markets: MarketData[] = selectLoginAccountPositionsMarkets();

  const marketsWithPositions = markets.map(market => ({
    ...market,
    userPositions: selectUserMarketPositions(market.id),
    myPositionsSummary: selectMarketPositionsSummary(market.id),
  }));

  return {
    markets: marketsWithPositions,
  };
}

// need to add marketInfos in case positions load before markets
export const selectLoginAccountPositionsMarkets = () => {
  const { accountPositions } = AppStatus.get();
  const { marketInfos } = Markets.get();

  return Object.keys(accountPositions).reduce((p, marketId) => {
    if (!Object.keys(marketInfos).includes(marketId)) return p;
    const market = selectMarket(marketId);
    return market ? [...p, market] : p;
  }, []);
};
