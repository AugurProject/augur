import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TradingForm from "modules/market/components/trading-form/trading-form";
import { createBigNumber } from "utils/create-big-number";
import { windowRef } from "utils/window-ref";
import {
  MARKET_REVIEW_TRADE_SEEN,
  MODAL_MARKET_REVIEW_TRADE,
} from "modules/common/constants";
import { updateModal } from "modules/modal/actions/update-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { handleFilledOnly } from "modules/alerts/actions/alerts";
import {
  updateTradeCost,
  updateTradeShares
} from "modules/trades/actions/update-trade-cost-shares";
import { placeMarketTrade } from "modules/trades/actions/place-market-trade";
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN
} from "modules/auth/actions/auth-status";
import { selectSortedMarketOutcomes } from "modules/markets/selectors/market";


const mapStateToProps = (state, ownProps) => {
  const { authStatus, loginAccount } = state;

  const hasFunds = !!state.loginAccount.balances.eth && !!state.loginAccount.balances.dai
  return {
    gasPrice: getGasPrice(state),
    availableEth: createBigNumber(state.loginAccount.balances.eth),
    availableDai: createBigNumber(state.loginAccount.balances.dai),
    hasFunds,
    isLogged: authStatus.isLogged,
    allowanceAmount: loginAccount.allowanceFormatted,
    isConnectionTrayOpen: authStatus.isConnectionTrayOpen,
    sortedOutcomes: selectSortedMarketOutcomes(ownProps.market.marketType, ownProps.market.outcomesFormatted),
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
        ...modal,
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
      placeMarketTrade({
        marketId,
        outcomeId,
        tradeInProgress,
        doNotCreateOrders,
        callback,
        onComplete,
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
    marketReviewTradeSeen: !!marketReviewTradeSeen,
  };
};

const TradingFormContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(TradingForm)
);

export default TradingFormContainer;
