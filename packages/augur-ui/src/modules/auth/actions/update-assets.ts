import {
  NodeStyleCallback,
} from 'modules/types';
import {
  updateLoginAccount,
} from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export const updateAssets = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  const { address } = loginAccount;
  return updateBalances(address, dispatch, callback);
};

function updateBalances(
  address: string,
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback
) {
  Promise.all([
    getRepBalance(address),
    getDaiBalance(address),
    getEthBalance(address),
  ]).then(amounts => {
    const rep = amounts[0];
    const dai = amounts[1];
    const eth = amounts[2];
    dispatch(updateLoginAccount({ balances: { rep, dai, eth } }));
    return callback(null, { rep, dai, eth });
  });
}
