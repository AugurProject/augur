import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { updateUniverse } from 'modules/universe/actions/update-universe';

export const loadDisputeWindow = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const Augur = augurSdk.get();
  const disputeWindow = await Augur.getDisputeWindow({
    augur: Augur.contracts.augur.address,
    universe: universe.id,
  });

  dispatch(updateUniverse({ disputeWindow }));
};
