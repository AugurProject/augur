import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import {
  updateMarketsListMeta,
  updateSelectedCategories,
} from 'modules/markets-list/actions/update-markets-list';
import {
  updateFilterSortOptions,
  MARKET_SORT,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  TEMPLATE_FILTER,
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
  updateMarketsListMeta: meta => dispatch(updateMarketsListMeta(meta)),
  updateMarketsSortBy: sortBy =>
    dispatch(updateFilterSortOptions(MARKET_SORT, sortBy)),
  updateMaxFee: maxFee =>
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee)),
  updateMaxSpread: maxLiquiditySpread =>
    dispatch(updateFilterSortOptions(MARKET_MAX_SPREAD, maxLiquiditySpread)),
  updateShowInvalid: showInvalid =>
    dispatch(updateFilterSortOptions(MARKET_SHOW_INVALID, showInvalid)),
  updateTemplateFilter: templateFilter =>
    dispatch(updateFilterSortOptions(TEMPLATE_FILTER, templateFilter)),
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
