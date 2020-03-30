import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  updateFilterSortOptions,
  MARKET_SORT,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListSortBy from '../components/inner-nav/markets-list-sortBy';

const mapStateToProps = (state) => {
  const { marketSort } = state.filterSortOptions;
  return {
    marketSort,
    isSearching: state.marketsList.isSearching,
    isMobile: state.appStatus.isMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMarketsSortBy: (sortBy) => dispatch(updateFilterSortOptions(MARKET_SORT, sortBy)),
});

const MarketsListSortByContainer = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
)(MarketsListSortBy);

export default MarketsListSortByContainer;
