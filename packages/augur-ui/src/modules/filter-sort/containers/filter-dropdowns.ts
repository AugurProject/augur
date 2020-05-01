import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FilterDropdown from 'modules/filter-sort/components/filter-dropdowns';
import {
  MARKET_SORT,
} from 'modules/app/store/constants';
import { AppStatusActions, AppStatusState } from 'modules/app/store/app-status';

const mapStateToProps = state => { 
  const { filterSortOptions: { marketSort: defaultSort }} = AppStatusState.get();
  return ({
    defaultSort,
  });
};
const mapDispatchToProps = dispatch => ({
  updateSortOption: sortOption => AppStatusActions.actions.updateFilterSortOptions({ [MARKET_SORT]: sortOption }),
});

const FilterDropdownsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterDropdown)
) as any;

export default FilterDropdownsContainer;
