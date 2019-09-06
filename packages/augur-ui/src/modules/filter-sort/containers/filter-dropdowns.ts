import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FilterDropdown from 'modules/filter-sort/components/filter-dropdowns';
import {
  updateFilterSortOptions,
  MARKET_FILTER,
  MARKET_SORT,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';

const mapStateToProps = state => ({
  defaultFilter: state.filterSortOptions.marketFilter,
  defaultSort: state.filterSortOptions.marketSort,
});

const mapDispatchToProps = dispatch => ({
  updateFilterOption: filterOption =>
    dispatch(updateFilterSortOptions(MARKET_FILTER, filterOption)),
  updateSortOption: sortOption =>
    dispatch(updateFilterSortOptions(MARKET_SORT, sortOption)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
});

const FilterDropdownsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterDropdown)
) as any;

export default FilterDropdownsContainer;
