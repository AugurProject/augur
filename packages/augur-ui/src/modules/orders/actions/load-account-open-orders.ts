import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'store';
import { updateUserOpenOrders, updateUserOpenOrdersInMarket } from 'modules/markets/actions/market-trading-history-management';
import { updateLoginAccount } from 'modules/account/actions/login-account';

export const loadAccountOpenOrders = (
  options: any = {},
  marketIdAggregator: Function
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const userOpenOrders = await Augur.getUserOpenOrders({
    universe: universe.id,
    account: loginAccount.mixedCaseAddress,
  });
  if (marketIdAggregator) marketIdAggregator(Object.keys(userOpenOrders.orders));
  dispatch(updateUserOpenOrders(userOpenOrders.orders));
  if (options.marketId) {
    // update orders in market, they could have been cancelled
    dispatch(updateUserOpenOrdersInMarket(options.marketId, userOpenOrders.orders));
  }
  if (userOpenOrders.totalOpenOrdersFrozenFunds) dispatch(updateLoginAccount({totalOpenOrdersFrozenFunds: userOpenOrders.totalOpenOrdersFrozenFunds}));
};

