import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsView from 'modules/markets/components/markets-view';

import getAllMarkets from 'modules/markets/selectors/markets-all';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted';

import { toggleFavorite } from 'modules/markets/actions/update-favorites';

import loadMarkets from 'modules/markets/actions/load-markets';
import { loadMarketsByTopic } from 'modules/markets/actions/load-markets-by-topic';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  isLogged: state.isLoggedIn,
  loginAccount: state.loginAccount,
  markets: getAllMarkets(),
  branch: state.branch,
  canLoadMarkets: !!getValue(state, 'branch.id'),
  scalarShareDenomination: getScalarShareDenomination(),
  hasLoadedMarkets: state.hasLoadedMarkets,
  hasLoadedTopic: state.hasLoadedTopic
});

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets()),
  loadMarketsByTopic: topic => dispatch(loadMarketsByTopic(topic)),
  updateMarketsFilteredSorted: filteredMarkets => dispatch(updateMarketsFilteredSorted(filteredMarkets)),
  clearMarketsFilteredSorted: () => dispatch(clearMarketsFilteredSorted()),
  toggleFavorite: marketID => dispatch(toggleFavorite(marketID)),
  loadMarketsInfo: marketIDs => dispatch(loadMarketsInfo(marketIDs))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { loadMarkets, loadMarketsByTopic } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadMarkets: () => loadMarkets(),
    loadMarketsByTopic: topic => loadMarketsByTopic(topic)
  };
};

const Markets = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketsView));

export default Markets;
