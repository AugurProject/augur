import { connect } from 'react-redux';
import Wrapper from 'modules/trading/components/wrapper';
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
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { addPendingOrder } from 'modules/orders/actions/pending-orders-management';
import { orderSubmitted } from 'services/analytics/helpers';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { isGnosisUnavailable } from 'modules/app/selectors/gnosis';

const getMarketPath = id => {
  return {
    pathname: makePath(MARKET),
    search: makeQuery({
      [MARKET_ID_PARAM_NAME]: id,
    }),
  };
};

const mapStateToProps = (state: AppState, ownProps) => {
  const { authStatus, loginAccount, appStatus, accountPositions, userOpenOrders, blockchain, newMarket } = state;
  const marketId = ownProps.market.id;
  const hasHistory = !!accountPositions[marketId] || !!userOpenOrders[marketId];
  const {
    gnosisEnabled: Gnosis_ENABLED,
  } = appStatus;
  const hasFunds = Gnosis_ENABLED
    ? !!loginAccount.balances.dai
    : !!loginAccount.balances.eth && !!loginAccount.balances.dai;

  let availableDai = totalTradingBalance(loginAccount)
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  return {
    hasHistory,
    gasPrice: getGasPrice(state),
    hasFunds,
    isLogged: authStatus.isLogged,
    Gnosis_ENABLED,
    currentTimestamp: blockchain.currentAugurTimestamp,
    availableDai,
    GnosisUnavailable: isGnosisUnavailable(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
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
    orderSubmitted: (type, marketId) => dispatch(orderSubmitted(type, marketId))
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

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Wrapper);

export default WrapperContainer;
