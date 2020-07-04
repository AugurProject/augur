import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  updateFilterSortOption,
  MARKET_SORT,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListSortBy from '../components/inner-nav/markets-list-sortBy';

const mapStateToProps = (state) => {
  const { sortBy } = state.filterSortOptions;
  return {
    sortBy,
    isSearching: state.marketsList.isSearching,
    isMobile: state.appStatus.isMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMarketsSortBy: (sortBy) => dispatch(updateFilterSortOption(MARKET_SORT, sortBy)),
});

const MarketsListSortByContainer = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
)(MarketsListSortBy);

export default MarketsListSortByContainer;
