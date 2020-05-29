import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsLandingPage from 'modules/markets-list/components/markets-landing-page';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import {
  loadMarketsByFilter,
  LoadMarketsFilterOptions,
} from 'modules/markets/actions/load-markets';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import { MODAL_SIGNUP, POPULAR_CATEGORIES } from 'modules/common/constants';
import { selectMarketStats } from 'modules/markets-list/selectors/markets-list';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const marketStats = selectMarketStats();
  const markets = selectMarkets();
  const {
    marketsList: { isSearching },
    universe: { id },
    categoryStats,
    isLogged,
    restoredAccount,
    isConnected,
  } = AppStatus.get();
  return {
    categoryStats,
    categoryData: marketStats,
    isConnected: isConnected && id != null,
    isLogged,
    restoredAccount,
    markets: markets.filter(market =>
      POPULAR_CATEGORIES.includes(market.categories[0])
    ),
    isSearching,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<void, AppState, Action>
) => {
  const { setModal } = AppStatus.actions;
  return {
    signupModal: () => setModal({ type: MODAL_SIGNUP }),
    loadMarketsByFilter: (
      filter: LoadMarketsFilterOptions,
      cb: NodeStyleCallback
    ) => loadMarketsByFilter(filter, cb),
  };
};

const Markets = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketsLandingPage)
);

export default Markets;
