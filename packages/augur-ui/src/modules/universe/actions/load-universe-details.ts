import { augurSdk } from 'services/augursdk';
import { ThunkAction } from 'redux-thunk';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { getMaxMarketEndTime } from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';

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
  dispatch(updateUniverse({ ...universeDetails, maxMarketEndTime }));
  AppStatus.actions.updateUniverse({ ...universeDetails, maxMarketEndTime });
  if (callback) callback();
};
