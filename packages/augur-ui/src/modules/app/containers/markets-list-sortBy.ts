import { connect } from 'react-redux';
import { compose } from 'redux';
import { MARKET_SORT } from 'modules/app/store/constants';
import MarketsListSortBy from '../components/inner-nav/markets-list-sortBy';
import { AppStatus } from '../store/app-status';

const mapStateToProps = state => {
  const {
    filterSortOptions: { marketSort },
    marketsList: { isSearching },
  } = AppStatus.get();
  return {
    marketSort,
    isSearching,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMarketsSortBy: sortBy =>
    AppStatus.actions.updateFilterSortOptions({ [MARKET_SORT]: sortBy }),
});

const MarketsListSortByContainer = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(MarketsListSortBy);

export default MarketsListSortByContainer;
