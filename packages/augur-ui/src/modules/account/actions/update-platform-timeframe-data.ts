import { updateUniverse } from 'modules/universe/actions/update-universe';
import logError from 'utils/log-error';
import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';

export const updatePlatformTimeframeData = (
  options: any = {},
  callback: any = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
): Promise<void> => {
  const { universe } = getState();
  const { blockchain: { currentAugurTimestamp }} = AppStatus.get();
  if (universe.id == null) return callback(null);

  const augur = augurSdk.get();
  const stats: Getters.Platform.PlatformActivityStatsResult = await augur.getPlatformActivityStats(
    {
      universe: universe.id,
      startTime: options.startTime ? options.startTime : 0,
      endTime: currentAugurTimestamp,
    }
  );

  dispatch(
    updateUniverse({
      timeframeData: {
        activeUsers: stats.activeUsers,
        marketsCreated: stats.marketsCreated,
        numberOfTrades: stats.numberOfTrades,
        disputedMarkets: stats.disputedMarkets,
        volume: stats.volume,
        amountStaked: stats.amountStaked,
      },
    } as any)
  );
};
