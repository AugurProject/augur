import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';

export const loadAccountOpenOrders = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { mixedCaseAddress: account },
    universe: { id: universe },
  } = AppStatus.get();
  const { refreshUserOpenOrders, updateLoginAccount } = AppStatus.actions;
  const Augur = augurSdk.get();
  const userOpenOrders = await Augur.getUserOpenOrders({
    universe,
    account,
  });
  refreshUserOpenOrders(userOpenOrders.orders);
  if (userOpenOrders.totalOpenOrdersFrozenFunds) {
    updateLoginAccount({
      totalOpenOrdersFrozenFunds: userOpenOrders.totalOpenOrdersFrozenFunds,
    });
  }
};
