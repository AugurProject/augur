import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketTradingForm from "modules/market/components/market-trading-form/market-trading-form";
import { createBigNumber } from "src/utils/create-big-number";
import { windowRef } from "utils/window-ref";
import {
  MARKET_REVIEW_TRADE_SEEN,
  MODAL_MARKET_REVIEW_TRADE
} from "modules/common-elements/constants";
import { updateModal } from "modules/modal/actions/update-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { handleFilledOnly } from "modules/alerts/actions/alerts";
import {
  updateTradeCost,
  updateTradeShares
} from "modules/trades/actions/update-trade-cost-shares";
import { placeTrade } from "modules/trades/actions/place-trade";
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN
} from "modules/auth/actions/update-auth-status";

const mapStateToProps = (state, ownProps) => {
  const { authStatus, appStatus } = state;

  return {
    gasPrice: getGasPrice(state),
    availableFunds: createBigNumber(state.loginAccount.eth || 0),
    isLogged: authStatus.isLogged,
    isConnectionTrayOpen: authStatus.isConnectionTrayOpen,
    isMobile: appStatus.isMobile
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
  handleFilledOnly: trade => dispatch(handleFilledOnly(trade)),
  updateTradeCost: (marketId, outcomeId, order, callback) =>
    dispatch(updateTradeCost({ marketId, outcomeId, ...order, callback })),
  updateTradeShares: (marketId, outcomeId, order, callback) =>
    dispatch(updateTradeShares({ marketId, outcomeId, ...order, callback })),
  marketReviewTradeModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_MARKET_REVIEW_TRADE,
        ...modal
      })
    ),
  onSubmitPlaceTrade: (
    marketId,
    outcomeId,
    tradeInProgress,
    doNotCreateOrders,
    callback,
    onComplete
  ) =>
    dispatch(
      placeTrade({
        marketId,
        outcomeId,
        tradeInProgress,
        doNotCreateOrders,
        callback,
        onComplete
      })
    )
});

const mergeProps = (sP, dP, oP) => {
  const marketReviewTradeSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(MARKET_REVIEW_TRADE_SEEN);

  return {
    ...oP,
    ...sP,
    ...dP,
    marketReviewTradeSeen: !!marketReviewTradeSeen
  };
};

const MarketTradingFormContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MarketTradingForm)
);

export default MarketTradingFormContainer;
