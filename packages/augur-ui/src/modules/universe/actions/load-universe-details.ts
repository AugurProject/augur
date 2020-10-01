import { augurSdk } from 'services/augursdk';
import { getMaxMarketEndTime } from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';

export const loadUniverseDetails = async (
  universe: string,
  account: string,
  callback?: Function
) => {
  const augur = augurSdk.get();
  const universeDetails = await augur.getUniverseChildren({
    universe,
    account,
  });
  const maxMarketEndTime = await getMaxMarketEndTime();
  const warpSyncHash = await augur.getMostRecentWarpSync();

  let result = { ...universeDetails, maxMarketEndTime }
  if (warpSyncHash?.hash) {
    result = {
      ...result,
      warpSyncHash: warpSyncHash.hash
    }
  }
  AppStatus.actions.updateUniverse(result);
  if (callback) callback();
};
