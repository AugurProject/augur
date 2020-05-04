import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';

export const loadDisputeWindow = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = AppStatus.get();
  const Augur = augurSdk.get();
  const disputeWindow = await Augur.getDisputeWindow({
    augur: Augur.contracts.augur.address,
    universe: universe.id,
  });

  AppStatus.actions.updateUniverse({ disputeWindow });
};
