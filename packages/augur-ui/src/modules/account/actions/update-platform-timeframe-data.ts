import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';

export const updatePlatformTimeframeData = async (
  options: { startTime: number },
  callback: any = logError
): Promise<void> => {
  const { universe: { id }, blockchain: { currentAugurTimestamp }} = AppStatus.get();
  if (id == null) return callback(null);

  const augur = augurSdk.get();
  const stats: Getters.Platform.PlatformActivityStatsResult = await augur.getPlatformActivityStats(
    {
      universe: id,
      startTime: options.startTime ? options.startTime : 0,
      endTime: currentAugurTimestamp,
    }
  );
  AppStatus.actions.updateUniverse({
    timeframeData: { ...stats },
  });
};
