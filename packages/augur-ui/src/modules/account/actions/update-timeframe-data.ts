import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';

export const updateTimeframeData = async (
  options: { startTime: number },
  callback: NodeStyleCallback = logError
): Promise<void> => {
  const {
    loginAccount,
    universe: { id },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  if (loginAccount.address == null || id == null) return callback(null);

  const augur = augurSdk.get();
  const stats: Getters.Users.AccountTimeRangedStatsResult = await augur.getAccountTimeRangedStats(
    {
      universe: id,
      account: loginAccount.address,
      startTime: options.startTime ? options.startTime : 0,
      endTime: currentAugurTimestamp,
    }
  );
  AppStatus.actions.updateLoginAccount({
    timeframeData: {
      ...stats,
    },
  });
};
