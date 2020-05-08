import { ThunkAction } from 'redux-thunk';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { switchUniverseState } from 'modules/app/actions/reset-state';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets';
import { ALL_MARKETS } from 'modules/common/constants';
import { setSelectedUniverse } from 'modules/auth/actions/selected-universe-management';
import { AppStatus } from 'modules/app/store/app-status';

export const switchUniverse = (
  universeId: string,
  history: History
): ThunkAction<any, any, any, any> => async (dispatch, getState) => {
  history.push({
    pathname: makePath(MARKETS, null),
  });
  const {
    loginAccount: { address: account },
    filterSortOptions: {
      maxFee,
      maxLiquiditySpread,
      marketSort: sort,
      marketFilter,
    },
  } = AppStatus.get();
  dispatch(
    loadUniverseDetails(universeId, account, () => {
      dispatch(switchUniverseState());
      AppStatus.actions.switchUniverse();
      dispatch(setSelectedUniverse(universeId));
      dispatch(loadUniverseForkingInfo());
      dispatch(loadDisputeWindow());
      dispatch(loadAccountData());

      const filter = {
        maxFee,
        maxLiquiditySpread,
        includeInvalidMarkets: false,
        sort,
        marketFilter,
        categories: [],
        search: '',
        filter: ALL_MARKETS,
        limit: 10,
        offset: 1,
      };
      // force `getMarkets` call to re-populate markets
      dispatch(loadMarketsByFilter(filter));
    })
  );
};
