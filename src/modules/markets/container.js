import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';

import MarketsView from 'modules/markets/components/markets-view';

import getMarkets from 'modules/markets/selectors/markets';
import getFilterSort from 'modules/markets/selectors/filter-sort';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import { selectLoginAccount } from 'modules/auth/selectors/login-account';
import { selectCreateMarketLink } from 'modules/link/selectors/links';
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header';
import { selectFavoriteMarkets } from 'modules/markets/selectors/markets-favorite';
import { selectPagination } from 'modules/markets/selectors/pagination';

import { loadMarkets } from 'modules/markets/actions/load-markets';

import { updateKeywords } from 'modules/markets/actions/update-keywords';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  markets: getMarkets(),
  marketsHeader: selectMarketsHeader(state),
  favoriteMarkets: selectFavoriteMarkets(state),
  branch: state.branch,
  scalarShareDenomination: getScalarShareDenomination(),
  pagination: selectPagination(state),
  filterSort: getFilterSort(),
  keywords: state.keywords,
  hasLoadedMarkets: state.hasLoadedMarkets,
  hasLoadedTopic: state.hasLoadedTopic
});

const mapDispatchToProps = dispatch => ({
  createMarketLink: selectCreateMarketLink(dispatch),
  onChangeKeywords: keywords => dispatch(updateKeywords(keywords))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { branch } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadMarkets: () => dispatch(loadMarkets(branch.id))
  };
};

const Markets = connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketsView);

export default Markets;
