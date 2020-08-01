import { augurSdk } from 'services/augursdk';
import { ThunkAction } from 'redux-thunk';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { getMaxMarketEndTime } from 'modules/contracts/actions/contractCalls';

export const loadUniverseDetails = (
  universe: string,
  account: string,
  callback?: Function
): ThunkAction<any, any, any, any> => async (dispatch, getState) => {
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
  dispatch(updateUniverse(result));
  if (callback) callback();
};
