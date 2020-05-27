import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { Markets } from 'modules/markets/store/markets';
import { AppStatus } from 'modules/app/store/app-status';

// need to add marketInfos in case positions load before markets
export const getLoginAccountClaimableWinnings = () => {
  const { accountPositions: positions } = AppStatus.get();
  const { marketInfos } = Markets.get();

  return Object.keys(positions).reduce(
    (p, marketId) => {
      if (!Object.keys(marketInfos).includes(marketId)) return p;
      const marketPosition = positions[marketId];
      if (
        createBigNumber(
          marketPosition.tradingPositionsPerMarket.unclaimedProfit
        ).gt(ZERO) ||
        createBigNumber(
          marketPosition.tradingPositionsPerMarket.unclaimedProceeds
        ).gt(ZERO)
      ) {
        const {
          unclaimedProfit,
          unclaimedProceeds,
          fee,
        } = marketPosition.tradingPositionsPerMarket;
        const market = selectMarket(marketId);
        if (market === null) return p;
        const result = {
          markets: [...p.markets, market],
          totals: {
            totalUnclaimedProfit: p.totals.totalUnclaimedProfit.plus(
              unclaimedProfit
            ),
            totalUnclaimedProceeds: p.totals.totalUnclaimedProceeds.plus(
              unclaimedProceeds
            ),
            totalFees: p.totals.totalFees.plus(
              fee
            )
          },
          positions: {
            ...p.positions,
            [market.id]: {
              unclaimedProfit,
              unclaimedProceeds,
              fee,
            },
          },
        };
        return result;
      }
      return p;
    },
    {
      markets: [],
      totals: {
        totalUnclaimedProfit: ZERO,
        totalUnclaimedProceeds: ZERO,
        totalFees: ZERO,
      },
      positions: {},
    }
  );
};
