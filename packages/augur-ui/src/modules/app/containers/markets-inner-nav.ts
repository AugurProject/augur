import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import {
  updateSelectedCategories,
} from 'modules/markets-list/actions/update-markets-list';
import {
  updateFilterSortOption,
  MARKET_SORT,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  TEMPLATE_FILTER,
  MARKET_LIMIT,
  MARKET_OFFSET,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = ({ marketsList, filterSortOptions, loginAccount }) => {
  return {
    selectedCategories: marketsList.selectedCategories,
    filterSortOptions: filterSortOptions,
    settings: loginAccount.settings,
  };
};

const mapDispatchToProps = dispatch => ({
  updateLoginAccount: settings => dispatch(updateLoginAccount({ settings })),
  updateSelectedCategories: categories =>
    dispatch(updateSelectedCategories(categories)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateFilterSortOption: (name, value) =>
    dispatch(updateFilterSortOption(name, value)),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...sP,
    ...dP,
    ...oP,
    updateLoginAccount: settings => dP.updateLoginAccount(Object.assign({}, sP.settings, settings)),
  }
};

const MarketsInnerNavContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
