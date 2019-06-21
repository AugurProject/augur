import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { ALL_ORDERS } from 'modules/common/constants';
import { AppState } from 'store';

export const loadAccountOpenOrders = (
  options: any = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadUserAccountOrders(
      options,
      (err: Error, { marketIds = [], orders = {} }: any) => {
        let allMarketIds = marketIds;
        if (options.marketId) {
          allMarketIds = allMarketIds.concat([options.marketId]);
          if (marketIdAggregator) marketIdAggregator(allMarketIds);
        }
        if (callback) callback(null, orders);
      }
    )
  );
};

const loadUserAccountOrders = (
  options = {},
  callback: NodeStyleCallback
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const orders = await Augur.getTradingOrders({
    ...options,
    universe: universe.id,
    creator: loginAccount.address,
    orderState: ALL_ORDERS,
  });
  callback(null, { marketIds: Object.keys(orders), orders });
};
