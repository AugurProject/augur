import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import {
  updateSelectedCategories,
} from 'modules/markets-list/actions/update-markets-list';
import {
  updateFilterSortOptionsSettings,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = ({ marketsList, filterSortOptions, loginAccount }) => {
  return {
    selectedCategories: marketsList.selectedCategories,
    filterSortOptions: filterSortOptions,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSelectedCategories: categories =>
    dispatch(updateSelectedCategories(categories)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateFilterSortOptionsSettings: filterOptions => updateFilterSortOptionsSettings(filterOptions),
});

const MarketsInnerNavContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
