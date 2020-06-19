import type { Getters } from '@augurproject/sdk';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { NodeStyleCallback } from 'modules/types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';

export const updateTimeframeData = (
  options: { startTime: number },
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
): Promise<void> => {
  const { universe, loginAccount, blockchain } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);

  const augur = augurSdk.get();
  const stats: Getters.Users.AccountTimeRangedStatsResult = await augur.getAccountTimeRangedStats(
    {
      universe: universe.id,
      account: loginAccount.address,
      startTime: options.startTime ? options.startTime : 0,
      endTime: blockchain.currentAugurTimestamp
    }
  );

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
