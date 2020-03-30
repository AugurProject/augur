import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { refreshUserOpenOrders } from 'modules/markets/actions/market-trading-history-management';
import { updateLoginAccount } from 'modules/account/actions/login-account';

export const loadAccountOpenOrders = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const userOpenOrders = await Augur.getUserOpenOrders({
    universe: universe.id,
    account: loginAccount.mixedCaseAddress,
  });
  dispatch(refreshUserOpenOrders(userOpenOrders.orders));
  if (userOpenOrders.totalOpenOrdersFrozenFunds)
    dispatch(
      updateLoginAccount({
        totalOpenOrdersFrozenFunds: userOpenOrders.totalOpenOrdersFrozenFunds,
      })
    );
};
