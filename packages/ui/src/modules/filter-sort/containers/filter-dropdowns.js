import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import FilterDropdown from "modules/filter-sort/components/filter-dropdowns/filter-dropdowns";
import {
  updateFilterSortOptions,
  MARKET_FILTER,
  MARKET_SORT,
  MARKET_MAX_FEES,
  HAS_OPEN_ORDERS
} from "modules/filter-sort/actions/update-filter-sort-options";
import { updateMobileMenuState } from "modules/app/actions/update-sidebar-status";

const mapStateToProps = state => ({
  defaultFilter: state.filterSortOptions.marketFilter,
  defaultSort: state.filterSortOptions.marketSort,
  defaultMaxFee: state.filterSortOptions.maxFee
});

const mapDispatchToProps = dispatch => ({
  updateFilterOption: filterOption =>
    dispatch(updateFilterSortOptions(MARKET_FILTER, filterOption)),
  updateSortOption: sortOption =>
    dispatch(updateFilterSortOptions(MARKET_SORT, sortOption)),
  updateMaxFee: maxFee =>
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee)),
  updateHasOpenOrders: hasOpenOrders =>
    dispatch(updateFilterSortOptions(HAS_OPEN_ORDERS, hasOpenOrders)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data))
});

const FilterDropdownsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterDropdown)
);

export default FilterDropdownsContainer;
