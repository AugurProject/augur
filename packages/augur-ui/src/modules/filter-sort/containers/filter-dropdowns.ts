import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FilterDropdown from 'modules/filter-sort/components/filter-dropdowns';
import {
  updateFilterSortOptions,
  MARKET_SORT,
} from 'modules/filter-sort/actions/update-filter-sort-options';

const mapStateToProps = state => ({
  defaultSort: state.filterSortOptions.marketSort,
});

const mapDispatchToProps = dispatch => ({
  updateSortOption: sortOption => dispatch(updateFilterSortOptions(MARKET_SORT, sortOption)),
});

const FilterDropdownsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterDropdown)
) as any;

export default FilterDropdownsContainer;
