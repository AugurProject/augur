import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { OPEN, REPORTING_STATE } from 'modules/common/constants';
import { AppState } from 'store';
import { updateUserOpenOrders, updateUserOpenOrdersInMarket } from 'modules/markets/actions/market-trading-history-management';

export const loadAccountOpenOrders = (
  options: any = {},
  marketIdAggregator: Function
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const orders = await Augur.getTradingOrders({
    ...options,
    universe: universe.id,
    account: loginAccount.mixedCaseAddress,
    orderState: OPEN,
    filterFinalized: true
  });
  if (marketIdAggregator) marketIdAggregator(Object.keys(orders));
  dispatch(updateUserOpenOrders(orders));
  if (options.marketId) {
    // update orders in market, they could have been cancelled
    dispatch(updateUserOpenOrdersInMarket(options.marketId, orders));
  }
};

