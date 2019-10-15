import { ThunkAction } from 'redux-thunk';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { AppState } from 'store';
import { updateEnv } from 'modules/app/actions/update-env';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';

export const switchUniverse = (
  universeId: string,
  history: History
): ThunkAction<any, any, any, any> => async (dispatch, getState) => {
  const { env, loginAccount } = getState() as AppState;
  const account = loginAccount.address;
  dispatch(updateEnv({ ...env, universe: universeId }));
  // todo clear markets, clear parts of login account
  // load markets again
  dispatch(
    loadUniverseDetails(universeId, account, () => {
      dispatch(loadUniverseForkingInfo());
      dispatch(loadDisputeWindow());
      dispatch(loadAccountData());
      history.push({
        pathname: makePath(MARKETS, null),
      });
      // force `getMarkets` call
    })
  );
};
