import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MarketView from 'modules/market/components/market-view/market-view';
import { loadFullMarket } from 'modules/markets/actions/load-full-market';
import { selectMarket, selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import {
  MODAL_MARKET_REVIEW,
  MARKET_REVIEW_SEEN,
  MODAL_MARKET_LOADING,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { hotloadMarket } from 'modules/markets/actions/load-markets';

const mapStateToProps = (state, ownProps) => {
  const { connection, universe } = state;
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  const market = ownProps.market || selectMarket(marketId);

  const marketReviewSeen =
    windowRef &&
    windowRef.localStorage &&
    Boolean(windowRef.localStorage.getItem(MARKET_REVIEW_SEEN));

  if (market === null) {
    return {
      isMarketLoading: true,
      isConnected: connection.isConnected && universe.id != null,
      canHotload: connection.canHotload,
      marketId,
      marketReviewSeen,
    };
  }


  return {
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    outcomes: market.outcomes || [],
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || '',
    market,
    marketId,
    universe,
    marketReviewSeen,
    sortedOutcomes: selectSortedMarketOutcomes(
      market.marketType,
      market.outcomesFormatted
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  hotloadMarket: marketId => hotloadMarket(marketId),
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  updateModal: modal => dispatch(updateModal(modal)),
  loadMarketTradingHistory: marketId =>
    dispatch(loadMarketTradingHistory(marketId)),
  marketReviewModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_REVIEW,
        ...modal,
      })
    ),
  showMarketLoadingModal: () =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_LOADING,
      })
    ),
    closeMarketLoadingModal: () => dispatch(closeModal()),
});

const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketView)
);

export default Market;
