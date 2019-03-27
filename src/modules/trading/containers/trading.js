import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createBigNumber } from "utils/create-big-number";
import { windowRef } from "utils/window-ref";

import { selectMarket } from "modules/markets/selectors/market";
import MarketTrading from "modules/trading/components/trading/trading";
import { MODAL_MARKET_REVIEW } from "modules/modal/constants/modal-types";
import { clearTradeInProgress } from "modules/trades/actions/update-trades-in-progress";
import { updateModal } from "modules/modal/actions/update-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { handleFilledOnly } from "modules/notifications/actions/notifications";
import { MARKET_REVIEW_SEEN } from "modules/modal/constants/local-storage-keys";

const mapStateToProps = state => ({
  availableFunds: createBigNumber(state.loginAccount.eth || 0),
  isLogged: state.authStatus.isLogged,
  isMobile: state.appStatus.isMobile,
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  clearTradeInProgress: marketId => dispatch(clearTradeInProgress(marketId)),
  handleFilledOnly: trade => dispatch(handleFilledOnly(trade)),
  marketReviewModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_REVIEW,
        ...modal
      })
    )
});

const mergeProps = (sP, dP, oP) => {
  const market = selectMarket(oP.marketId);
  const marketReviewSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(MARKET_REVIEW_SEEN);

  return {
    ...sP,
    ...dP,
    ...oP,
    market,
    marketReviewSeen: !!marketReviewSeen
  };
};

const MarketTradingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MarketTrading)
);

export default MarketTradingContainer;
