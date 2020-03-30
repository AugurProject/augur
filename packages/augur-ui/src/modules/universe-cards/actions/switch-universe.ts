import { ThunkAction } from 'redux-thunk';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { switchUniverseState } from 'modules/app/actions/reset-state';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { AppState } from 'appStore';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets';
import { ALL_MARKETS } from 'modules/common/constants';

export const switchUniverse = (
  universeId: string,
  history: History
): ThunkAction<any, any, any, any> => async (dispatch, getState) => {
  const { loginAccount, filterSortOptions } = getState() as AppState;
  const account = loginAccount.address;
  history.push({
    pathname: makePath(MARKETS, null),
  });
  dispatch(
    loadUniverseDetails(universeId, account, () => {
      dispatch(switchUniverseState());
      dispatch(loadUniverseForkingInfo());
      dispatch(loadDisputeWindow());
      dispatch(loadAccountData());

      const filter = {
        maxFee: filterSortOptions.maxFee,
        maxLiquiditySpread: filterSortOptions.maxLiquiditySpread,
        includeInvalidMarkets: false,
        sort: filterSortOptions.marketSort,
        marketFilter: filterSortOptions.marketFilter,
        categories: [],
        search: '',
        filter: ALL_MARKETS,
        limit: 10,
        offset: 1
      };
      // force `getMarkets` call to re-populate markets
      loadMarketsByFilter(filter);
    })
  );
};
