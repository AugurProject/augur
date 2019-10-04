import { augurSdk } from 'services/augursdk';
import { ThunkAction } from 'redux-thunk';
import { updateUniverse } from 'modules/universe/actions/update-universe';

export const loadUniverseDetails = (
  universe: string,
  account: string
): ThunkAction<any, any, any, any> => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const universeDetails= await augur.getUniverseChildren
  ({
    universe,
    account
  });
  dispatch(updateUniverse({ ...universeDetails }));
}
