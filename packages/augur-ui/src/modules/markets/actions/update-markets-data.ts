import { MarketInfos } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Markets } from '../store/markets';

export const addUpdateMarketInfos = (
  marketsInfo: Getters.Markets.MarketInfo[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  const marketInfos = marketsInfo.reduce(
    (p, m) => ({ ...p, [m.id]: m }),
    {}
  );
  Markets.actions.updateMarketsData(marketInfos);
};