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

const mapStateToProps = (state) => {
  const { maxFee, maxLiquiditySpread, showInvalid } = state.filterSortOptions;
  return {
    maxFee,
    maxLiquiditySpread,
    showInvalid,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMaxFee: maxFee =>
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee)),
  updateMaxSpread: maxLiquiditySpread =>
    dispatch(updateFilterSortOptions(MARKET_MAX_SPREAD, maxLiquiditySpread)),
  updateShowInvalid: showInvalid =>
    dispatch(updateFilterSortOptions(MARKET_SHOW_INVALID, showInvalid)),
});

const MarketsListFiltersContainer = withRouter(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
)(MarketsListFilters));

export default MarketsListFiltersContainer;
