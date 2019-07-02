import { augur } from 'services/augurjs';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import logError from 'utils/log-error';
import { AppState } from 'store';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export const updatePlatformTimeframeData = (
  options: any = {},
  callback: any = logError
) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
): void => {
  const { universe } = getState();
  if (universe.id == null) return callback(null);
  dispatch(
    updateUniverse({
      timeframeData: {
        activeUsers: 0,
        marketsCreated: 0,
        numberOfTrades: 0,
        disputedMarkets: 0,
        volume: 0,
        amountStaked: 0,
      },
    } as any)
  );
};
