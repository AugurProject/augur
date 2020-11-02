import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { History } from 'history';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets';
import { ALL_MARKETS } from 'modules/common/constants';
import { setSelectedUniverse } from 'modules/auth/actions/selected-universe-management';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

export const switchUniverse = async (
  universeId: string,
  history: History
) => {
  history.push({
    pathname: makePath(MARKETS, null),
  });
  const {
    loginAccount: { address: account },
    filterSortOptions: {
      maxFee,
      maxLiquiditySpread,
      sortBy: sort,
      marketFilter,
    },
  } = AppStatus.get();
  loadUniverseDetails(universeId, account, () => {
    AppStatus.actions.switchUniverse();
    setSelectedUniverse(universeId);
    loadUniverseForkingInfo();
    loadDisputeWindow();
    loadAccountData();

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
    Markets.actions.updateMarketsData(
      null,
      loadMarketsByFilter(filter));
  });
};
