import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketView from "modules/market/components/market-view/market-view";
import { loadFullMarket } from "modules/markets/actions/load-full-market";
import { selectMarket } from "modules/markets/selectors/market";
import parseQuery from "modules/routes/helpers/parse-query";
import { MARKET_ID_PARAM_NAME } from "modules/routes/constants/param-names";
import {
  MODAL_MARKET_REVIEW,
  MARKET_REVIEW_SEEN,
  MARKET_REVIEWS
} from "modules/common-elements/constants";
import { windowRef } from "utils/window-ref";
import getPrecision from "utils/get-number-precision";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { createBigNumber } from "src/utils/create-big-number";
import { updateModal } from "modules/modal/actions/update-modal";
import { loadMarketTradingHistory } from "modules/markets/actions/market-trading-history-management";

const mapStateToProps = (state, ownProps) => {
  const {
    marketsData,
    authStatus,
    appStatus,
    connection,
    universe,
    orderBooks
  } = state;
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  const market = selectMarket(marketId);
  const pricePrecision = market && getPrecision(market.tickSize, 4);
  let marketReviewSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(MARKET_REVIEW_SEEN);

  const marketReview =
    windowRef &&
    windowRef.localStorage &&
    JSON.parse(windowRef.localStorage.getItem(MARKET_REVIEWS));

  // If market review modal has been seen for this market, do not show again
  if (marketReview && marketReview.includes(marketId)) {
    marketReviewSeen = true;
  }

  return {
    availableFunds: createBigNumber(state.loginAccount.eth || 0),
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    outcomes: market.outcomes || [],
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || "",
    isLogged: authStatus.isLogged,
    market,
    minPrice: market.minPrice || createBigNumber(0),
    maxPrice: market.maxPrice || createBigNumber(0),
    universe,
    orderBooks,
    isMobile: appStatus.isMobile,
    marketId,
    marketsData,
    pricePrecision,
    marketReviewSeen: !!marketReviewSeen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  updateModal: modal => dispatch(updateModal(modal)),
  loadMarketTradingHistory: marketId =>
    dispatch(loadMarketTradingHistory({ marketId })),
  marketReviewModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_REVIEW,
        ...modal
      })
    )
});

const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketView)
);

export default Market;
