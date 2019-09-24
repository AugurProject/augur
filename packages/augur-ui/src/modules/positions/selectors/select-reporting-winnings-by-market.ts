import { createSelector } from 'reselect';

import store from 'store';
import {
  selectMarketInfosState,
  selectLoginAccountReportingState,
} from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { MarketData } from 'modules/types';

interface MarketReportContracts {
  marketId: string;
  marketObject: MarketData;
  contracts: string[];
  totalAmount: BigNumber;
}

export const selectReportingWinningsByMarket = (
  state
): MarketReportContracts[] => {
  return getReportingWinningsByMarket(state);
};

// need to add marketInfos in case positions load before markets
const getReportingWinningsByMarket = createSelector(
  selectLoginAccountReportingState,
  selectMarketInfosState,
  (userReporting, markets) => {
    // this is just a stub
    return [
      {
        marketId: '0xxxx',
        marketObject: {},
        contracts: [],
        totalAmount: ZERO,
      },
    ];
  }
);
