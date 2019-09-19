import { createSelector } from 'reselect';

import store from 'store';
import {
  selectAccountPositionsState,
  selectMarketInfosState,
} from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { MarketClaimablePositions } from 'modules/types';

export const selectLoginAccountClaimablePositions  = (state): MarketClaimablePositions => {
  console.log("selectLoginAccountClaimablePositions")
  return getLoginAccountPositionsMarkets(state);
}

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
            positions: {
              ...p.positions,
              [market.id]: [
                {
                  unclaimedProfit,
                  unclaimedProceeds
                },
              ],
            },
          };
          return result;
        }
        return p;
      },
      {
        markets: [],
        positions: {},
      }
    );
  }
);
