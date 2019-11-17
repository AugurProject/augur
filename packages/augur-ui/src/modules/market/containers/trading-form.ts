import { connect } from 'react-redux';
import { augurSdk } from 'services/augursdk';
import TradingForm from 'modules/market/components/trading-form/trading-form';
import { createBigNumber } from 'utils/create-big-number';
import { windowRef } from 'utils/window-ref';
import {
  DISCLAIMER_SEEN,
  MODAL_DISCLAIMER,
  MODAL_ADD_FUNDS,
  MODAL_LOGIN,
  MODAL_SIGNUP,
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
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import getValue from 'utils/get-value';
import { addPendingOrder } from 'modules/orders/actions/pending-orders-management';

const getMarketPath = id => {
  return {
    pathname: makePath(MARKET),
    search: makeQuery({
      [MARKET_ID_PARAM_NAME]: id,
    }),
  };
};

const mapStateToProps = (state, ownProps) => {
  const { authStatus, loginAccount } = state;

  const Gnosis_ENABLED = getValue(state, 'appStatus.gnosisEnabled');
  const ethToDaiRate = getValue(state, 'appStatus.ethToDaiRate');
  const gnosisStatus = getValue(state, 'appStatus.gnosisStatus');
  const hasFunds = Gnosis_ENABLED
    ? !!state.loginAccount.balances.dai
    : !!state.loginAccount.balances.eth && !!state.loginAccount.balances.dai;

  const selectedOutcomeId =
    ownProps.selectedOutcomeId !== undefined &&
    ownProps.selectedOutcomeId !== null
      ? ownProps.selectedOutcomeId
      : ownProps.market.defaultSelectedOutcomeId;
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
    currentTimestamp: state.blockchain.currentAugurTimestamp,
    orderBook: cumulativeOrderBook,
    isLogged: authStatus.isLogged,
    allowanceBigNumber: loginAccount.allowance,
    isConnectionTrayOpen: authStatus.isConnectionTrayOpen,
    sortedOutcomes: selectSortedMarketOutcomes(
      ownProps.market.marketType,
      ownProps.market.outcomesFormatted
    ),
    Gnosis_ENABLED,
    ethToDaiRate,
    gnosisStatus,
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
  disclaimerModal: modal =>
    dispatch(
      updateModal({
        type: MODAL_DISCLAIMER,
        ...modal,
      })
    ),
  addFundsModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
  addPendingOrder: (order, marketId) => dispatch(addPendingOrder(order, marketId)),
  loginModal: () =>
    dispatch(
      updateModal({
        type: MODAL_LOGIN,
        pathName: getMarketPath(ownProps.market.id),
      })
    ),
  signupModal: () =>
    dispatch(
      updateModal({
        type: MODAL_SIGNUP,
        pathName: getMarketPath(ownProps.market.id),
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
  const disclaimerSeen =
    windowRef &&
    windowRef.localStorage &&
    windowRef.localStorage.getItem(DISCLAIMER_SEEN);

  return {
    ...oP,
    ...sP,
    ...dP,
    disclaimerSeen: !!disclaimerSeen,
  };
};

const TradingFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TradingForm);

export default TradingFormContainer;
