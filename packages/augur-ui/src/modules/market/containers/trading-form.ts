import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TradingForm from 'modules/market/components/trading-form/trading-form';
import { createBigNumber } from 'utils/create-big-number';
import { windowRef } from 'utils/window-ref';
import {
  MARKET_REVIEW_TRADE_SEEN,
  MODAL_MARKET_REVIEW_TRADE,
  DISCLAIMER_SEEN,
  MODAL_DISCLAIMER,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import {
  updateTradeCost,
  updateTradeShares,
} from 'modules/trades/actions/update-trade-cost-shares';
import { placeMarketTrade } from 'modules/trades/actions/place-market-trade';
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN,
} from 'modules/auth/actions/auth-status';
import { selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import orderAndAssignCumulativeShares from 'modules/markets/helpers/order-and-assign-cumulative-shares';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { LoginAccount } from 'modules/types';

const mapStateToProps = (state, ownProps) => {
  const { authStatus, loginAccount } = state;

  const hasFunds =
    !!state.loginAccount.balances.eth && !!state.loginAccount.balances.dai;

  const selectedOutcomeId =
    ownProps.selectedOutcomeId !== undefined &&
    ownProps.selectedOutcomeId !== null
      ? ownProps.selectedOutcomeId
      : market.defaultSelectedOutcomeId;
  let outcomeOrderBook = {};
  if (ownProps.initialLiquidity) {
    outcomeOrderBook = formatOrderBook(
      ownProps.market.orderBook[selectedOutcomeId]
    );
  }

  const cumulativeOrderBook = orderAndAssignCumulativeShares(outcomeOrderBook);

  return {
    gasPrice: getGasPrice(state),
    availableEth: createBigNumber(state.loginAccount.balances.eth),
    availableDai: createBigNumber(state.loginAccount.balances.dai),
    hasFunds,
    orderBook: cumulativeOrderBook,
    isLogged: authStatus.isLogged,
    allowanceBigNumber: loginAccount.allowance,
    isConnectionTrayOpen: authStatus.isConnectionTrayOpen,
    sortedOutcomes: selectSortedMarketOutcomes(
      ownProps.market.marketType,
      ownProps.market.outcomesFormatted
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
  handleFilledOnly: trade => null,
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
  disclaimerModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_DISCLAIMER,
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
    ),
});

const mergeProps = (sP, dP, oP) => {
  const marketReviewTradeSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(MARKET_REVIEW_TRADE_SEEN);

  const disclaimerSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(DISCLAIMER_SEEN);

  return {
    ...oP,
    ...sP,
    ...dP,
    marketReviewTradeSeen: !!marketReviewTradeSeen,
    disclaimerSeen: !!disclaimerSeen,
  };
};

const TradingFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TradingForm);

export default TradingFormContainer;
