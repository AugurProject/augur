import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsView from 'modules/markets/components/markets-view';

import getAllMarkets from 'modules/markets/selectors/markets-all';
import getFilterSort from 'modules/markets/selectors/filter-sort';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted';

import { selectCreateMarketLink } from 'modules/link/selectors/links';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';

import { loadMarkets } from 'modules/markets/actions/load-markets';
import { loadMarketsByTopic } from 'modules/markets/actions/load-markets-by-topic';

import { updateKeywords } from 'modules/markets/actions/update-keywords';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  loginAccount: state.loginAccount,
  markets: getAllMarkets(),
  // marketsHeader: selectMarketsHeader(state),
  // favoriteMarkets: selectFavoriteMarkets(state),
  branch: state.branch,
  canLoadMarkets: !!getValue(state, 'branch.id'),
  scalarShareDenomination: getScalarShareDenomination(),
  // pagination: selectPagination(state),
  filterSort: getFilterSort(),
  keywords: state.keywords,
  hasLoadedMarkets: state.hasLoadedMarkets,
  hasLoadedTopic: state.hasLoadedTopic
});

const mapDispatchToProps = dispatch => ({
  createMarketLink: selectCreateMarketLink(dispatch),
  onChangeKeywords: keywords => dispatch(updateKeywords(keywords)),
  loadMarkets: branchID => dispatch(loadMarkets(branchID)),
  loadMarketsByTopic: (topic, branchID) => dispatch(loadMarketsByTopic(topic, branchID)),
  updateMarketsFilteredSorted: filteredMarkets => dispatch(updateMarketsFilteredSorted(filteredMarkets)),
  clearMarketsFilteredSorted: () => dispatch(clearMarketsFilteredSorted()),
  toggleFavorite: marketID => dispatch(toggleFavorite(marketID))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { branch } = stateProps;
  const { loadMarkets, loadMarketsByTopic } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadMarkets: () => loadMarkets(branch.id),
    loadMarketsByTopic: topic => loadMarketsByTopic(topic, branch.id)
  };
};

// const Markets = connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketsView);
const Markets = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketsView));

export default Markets;
