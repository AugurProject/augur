import { updateLoginAccount } from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';

export const updateTimeframeData = (
  options: { startTime: number },
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
): Promise<void> => {
  const { loginAccount, universe: { id }, blockchain: { currentAugurTimestamp }} = AppStatus.get();
  if (loginAccount.address == null || id == null)
    return callback(null);

  const augur = augurSdk.get();
  const stats: Getters.Users.AccountTimeRangedStatsResult = await augur.getAccountTimeRangedStats(
    {
      universe: id,
      account: loginAccount.address,
      startTime: options.startTime ? options.startTime : 0,
      endTime: currentAugurTimestamp
    }
  );
  AppStatus.actions.updateLoginAccount({
    timeframeData: {
      positions: stats.positions,
      numberOfTrades: stats.numberOfTrades,
      marketsTraded: stats.marketsTraded,
      marketsCreated: stats.marketsCreated,
      successfulDisputes: stats.successfulDisputes,
      redeemedPositions: stats.redeemedPositions,
    },
  });
  dispatch(
    updateLoginAccount({
      timeframeData: {
        positions: stats.positions,
        numberOfTrades: stats.numberOfTrades,
        marketsTraded: stats.marketsTraded,
        marketsCreated: stats.marketsCreated,
        successfulDisputes: stats.successfulDisputes,
        redeemedPositions: stats.redeemedPositions,
      },
    })
  );
};
