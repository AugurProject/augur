import { connect } from 'react-redux';
import MarketsView from 'modules/markets/components/markets-view';

import getMarkets from 'modules/markets/selectors/markets';
import getFilterSort from 'modules/markets/selectors/filter-sort';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import { selectLoginAccount } from 'modules/account/selectors/login-account';
import { selectCreateMarketLink } from 'modules/link/selectors/links';
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header';
import { selectFavoriteMarkets } from 'modules/markets/selectors/markets-favorite';
import { selectPagination } from 'modules/markets/selectors/pagination';

import { updateScalarMarketShareDenomination } from 'modules/market/actions/update-scalar-market-share-denomination';
import { updateKeywords } from 'modules/markets/actions/update-keywords';

import { DENOMINATIONS } from 'modules/market/constants/share-denominations';

const mapStateToProps = state => ({
  loginAccount: selectLoginAccount(state),
  markets: getMarkets(),
  marketsHeader: selectMarketsHeader(state),
  favoriteMarkets: selectFavoriteMarkets(state),
  branch: state.branch,
  scalarShareDenomination: getScalarShareDenomination(),
  pagination: selectPagination(state),
  filterSort: getFilterSort(),
  keywords: state.keywords
});

const mapDispatchToProps = dispatch => ({
  createMarketLink: selectCreateMarketLink(dispatch),
  onChangeKeywords: keywords => dispatch(updateKeywords(keywords))
});

const Markets = connect(mapStateToProps, mapDispatchToProps)(MarketsView);

export default Markets;
