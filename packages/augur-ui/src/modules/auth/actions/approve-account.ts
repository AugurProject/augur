import logError from 'utils/log-error';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { getAllowance } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { formatDai } from 'utils/format-number';

export function checkAccountAllowance(
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount } = getState();
    if (!loginAccount.address) {
      console.log('User not logged in, check that wallet is connected');
      return callback(null, '0');
    }
    const allowance = await getAllowance(loginAccount.address);
    callback(null, allowance);
    dispatch(
      updateLoginAccount({
        allowance,
        allowanceFormatted: formatDai(allowance),
      })
    );
  };
}
