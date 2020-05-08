import logError from 'utils/log-error';
import { getAllowance } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { formatDai } from 'utils/format-number';
import { AppStatus } from 'modules/app/store/app-status';

export function checkAccountAllowance(
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount: { address }} = AppStatus.get();
    if (!address) {
      console.log('User not logged in, check that wallet is connected');
      return callback(null, '0');
    }
    const allowance = await getAllowance(address);
    callback(null, allowance);
    AppStatus.actions.updateLoginAccount({
      allowance,
      allowanceFormatted: formatDai(allowance),
    });
  };
}
