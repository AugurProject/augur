import logError from 'utils/log-error';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { isApprovedToTrade } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export function checkAccountApproval(
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount } = getState();
    console.log('check account approval');
    if (!loginAccount.address) {
      console.log('User not logged in, check that wallet is connected');
      return callback(null, '0');
    }
    const tradingApproved = await isApprovedToTrade(loginAccount.address);
    console.log('user is approved for trading', tradingApproved);
    dispatch(
      updateLoginAccount({
        tradingApproved
      })
    );
  };
}
