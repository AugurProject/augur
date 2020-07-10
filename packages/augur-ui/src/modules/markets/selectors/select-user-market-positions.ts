import { positionSummary } from 'modules/positions/selectors/positions-summary';
import { Getters } from '@augurproject/sdk';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppStatus } from 'modules/app/store/app-status';

export const selectUserMarketPositions = (
  marketId
): Getters.Users.TradingPosition[] => {
  const { accountPositions } = AppStatus.get();
  const marketInfo = selectMarket(marketId);
  const marketAccountPositions = accountPositions[marketId];
  if (
    !marketInfo ||
    !marketAccountPositions ||
    !marketAccountPositions.tradingPositions
  )
    return [];
  const { marketType, reportingState } = marketInfo;
  const isFullLoss = marketAccountPositions.tradingPositionsPerMarket?.fullLoss;
  const userPositions = Object.values(
    marketAccountPositions.tradingPositions || []
  ).map(value => {
    const position = value as Getters.Users.TradingPosition;
    const outcome = marketInfo.outcomesFormatted[position.outcome];
    return {
      ...positionSummary(
        position,
        outcome,
        marketType,
        reportingState,
        isFullLoss
      ),
      outcomeName: outcome.description,
    };
  });
  return userPositions;
};
