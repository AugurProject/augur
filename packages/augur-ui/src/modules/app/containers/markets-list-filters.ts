import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFilterSortOptionsSettings } from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListFilters from '../components/inner-nav/markets-list-filters';
import { AppState } from 'appStore';
import { updateSelectedCategories } from 'modules/markets-list/actions/update-markets-list';

const mapStateToProps = ({
  filterSortOptions,
  marketsList,
  appStatus,
}: AppState) => {
  return {
    isSearching: marketsList.isSearching,
    isMobile: appStatus.isMobile,
    filterSortOptions,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSelectedCategories: category =>
    dispatch(updateSelectedCategories(category)),
  updateFilterSortOptionsSettings: filterOptions =>
    dispatch(updateFilterSortOptionsSettings(filterOptions)),
});

const MarketsListFiltersContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketsListFilters)
);

export default MarketsListFiltersContainer;
