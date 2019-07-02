import { augur } from 'services/augurjs';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
import { TimeframeData } from 'modules/types';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const updateTimeframeData = (
  options: any = {},
  callback: any = logError
) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
): void => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);
  dispatch(
    updateLoginAccount({
      timeframeData: {
        positions: 0,
        numberOfTrades: 0,
        marketsTraded: 0,
        marketsCreated: 0,
        successfulDisputes: 0,
        redeemedPositions: 0,
      },
    })
  );
};
