import logError from 'utils/log-error';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { getAllowance } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { approveToTrade } from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { TEN_TO_THE_EIGHTEENTH_POWER } from 'modules/common/constants';
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

export function approveAccount() {
  return (dispatch, getState) => {
    // TODO: when we get design this number will come from modal
    const allowance = createBigNumber(1000000).times(
      TEN_TO_THE_EIGHTEENTH_POWER
    );
    approveToTrade(allowance);
  };
}
