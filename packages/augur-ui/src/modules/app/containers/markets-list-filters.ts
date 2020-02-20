import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  updateFilterSortOptions,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListFilters from '../components/inner-nav/markets-list-filters';
import { TEMPLATE_FILTER } from 'modules/common/constants';
import { Getters } from '@augurproject/sdk';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  const { maxFee, maxLiquiditySpread, includeInvalidMarkets, templateFilter } = state.filterSortOptions;
  return {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    isSearching: state.marketsList.isSearching,
    allTemplateFilter: templateFilter,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMaxFee: maxFee =>
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee)),
  updateMaxSpread: maxLiquiditySpread =>
    dispatch(updateFilterSortOptions(MARKET_MAX_SPREAD, maxLiquiditySpread)),
  updateShowInvalid: showInvalid =>
    dispatch(updateFilterSortOptions(MARKET_SHOW_INVALID, showInvalid)),
  updateTemplateFilter: templateFilter =>
    dispatch(updateFilterSortOptions(TEMPLATE_FILTER, templateFilter)),
});

const MarketsListFiltersContainer = withRouter(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
)(MarketsListFilters));

export default MarketsListFiltersContainer;
