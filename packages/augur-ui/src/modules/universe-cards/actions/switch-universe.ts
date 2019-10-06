import { ThunkAction } from 'redux-thunk';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';

export const switchUniverse = (
  universeId: string,
  account: string
): ThunkAction<any, any, any, any> => async (
  dispatch,
  getState
) => {
  dispatch(loadUniverseDetails(universeId, account));
  dispatch(loadUniverseForkingInfo());
  dispatch(loadDisputeWindow());
  return;
}
