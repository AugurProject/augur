import { connect } from 'react-redux';
import { compose } from 'redux';
import { MARKET_SORT } from 'modules/app/store/constants';
import MarketsListSortBy from '../components/inner-nav/markets-list-sortBy';
import { AppStatusState, AppStatusActions } from '../store/app-status';

const mapStateToProps = state => {
  const {
    filterSortOptions: { marketSort },
  } = AppStatusState.get();
  return {
    marketSort,
    isSearching: state.marketsList.isSearching,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMarketsSortBy: sortBy =>
    AppStatusActions.actions.updateFilterSortOptions({ [MARKET_SORT]: sortBy }),
});

const MarketsListSortByContainer = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(MarketsListSortBy);

export default MarketsListSortByContainer;
