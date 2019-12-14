import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import { updateMarketsListMeta, updateSelectedCategories } from 'modules/markets-list/actions/update-markets-list';
import { updateFilterSortOptions, MARKET_SORT, MARKET_MAX_FEES, MARKET_MAX_SPREAD, MARKET_SHOW_INVALID, TEMPLATE_FILTER } from 'modules/filter-sort/actions/update-filter-sort-options';

const mapStateToProps = (state) => {
  return {
    selectedCategories: state.marketsList.selectedCategories,
    filterSortOptions: state.filterSortOptions
  };
};

const mapDispatchToProps = dispatch => ({
  updateSelectedCategories: (categories) => dispatch(updateSelectedCategories(categories)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateMarketsListMeta: (meta) => dispatch(updateMarketsListMeta(meta)),
  updateMarketsSortBy: (sortBy) => dispatch(updateFilterSortOptions(MARKET_SORT, sortBy)),
  updateMaxFee: maxFee =>
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee)),
  updateMaxSpread: maxLiquiditySpread =>
    dispatch(updateFilterSortOptions(MARKET_MAX_SPREAD, maxLiquiditySpread)),
  updateShowInvalid: showInvalid =>
    dispatch(updateFilterSortOptions(MARKET_SHOW_INVALID, showInvalid)),
  updateTemplateFilter: templateFilter =>
    dispatch(updateFilterSortOptions(TEMPLATE_FILTER, templateFilter)),
});

const MarketsInnerNavContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
