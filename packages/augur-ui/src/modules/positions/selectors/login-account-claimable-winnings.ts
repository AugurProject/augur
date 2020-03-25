import { createSelector } from 'reselect';

import store from 'appStore';
import {
  selectAccountPositionsState,
  selectMarketInfosState,
} from 'appStore/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { MarketClaimablePositions } from 'modules/types';

export const selectLoginAccountClaimablePositions = (
  state
): MarketClaimablePositions => {
  return getLoginAccountPositionsMarkets(state);
};

// need to add marketInfos in case positions load before markets
const getLoginAccountPositionsMarkets = createSelector(
  selectAccountPositionsState,
  selectMarketInfosState,
  (positions, markets) => {
    return Object.keys(positions).reduce(
      (p, marketId) => {
        if (!Object.keys(markets).includes(marketId)) return p;
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
            },
            positions: {
              ...p.positions,
              [market.id]: {
                unclaimedProfit,
                unclaimedProceeds,
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
        },
        positions: {},
      }
    );
  }
);
