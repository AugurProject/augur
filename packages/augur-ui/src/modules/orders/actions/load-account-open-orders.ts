import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { OPEN, FINALIZE } from 'modules/common/constants';
import { AppState } from 'store';
import { updateUserOpenOrders } from 'modules/markets/actions/market-trading-history-management';

export const loadAccountOpenOrders = (
  options: any = {},
  marketIdAggregator: Function
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const orders = await Augur.getTradingOrders({
    ...options,
    universe: universe.id,
    creator: loginAccount.address,
    orderState: OPEN,
    ignoreReportingStates: [FINALIZE]
  });
  if (marketIdAggregator) marketIdAggregator(Object.keys(orders));
  dispatch(updateUserOpenOrders(orders));
};

