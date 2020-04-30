import { connect } from 'react-redux';
import Wrapper from 'modules/trading/components/wrapper';
import {
  DISCLAIMER_SEEN,
  MODAL_DISCLAIMER,
  MODAL_ADD_FUNDS,
  MODAL_LOGIN,
  MODAL_SIGNUP,
  MODAL_INITIALIZE_ACCOUNT,
  GSN_WALLET_SEEN,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import getGasPrice from 'modules/auth/selectors/get-gas-price';
import {
  updateTradeCost,
  updateTradeShares,
} from 'modules/trades/actions/update-trade-cost-shares';
import { placeMarketTrade } from 'modules/trades/actions/place-market-trade';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { orderSubmitted } from 'services/analytics/helpers';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { AppStatusState } from 'modules/app/store/app-status';

const getMarketPath = id => {
  return {
    pathname: makePath(MARKET),
    search: makeQuery({
      [MARKET_ID_PARAM_NAME]: id,
    }),
  };
};

const mapStateToProps = (state: AppState, ownProps) => {
  const {
    loginAccount,
    accountPositions,
    userOpenOrders,
    newMarket,
  } = state;
  const marketId = ownProps.market.id;
  const hasHistory = !!accountPositions[marketId] || !!userOpenOrders[marketId];
  const {
    gsnEnabled: GsnEnabled,
    isLogged,
    restoredAccount,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatusState.get();
  const hasFunds = GsnEnabled
    ? !!loginAccount.balances.dai
    : !!loginAccount.balances.eth && !!loginAccount.balances.dai;

  let availableDai = totalTradingBalance(loginAccount);
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  return {
    hasHistory,
    gasPrice: getGasPrice(),
    hasFunds,
    isLogged,
    restoredAccount,
    GsnEnabled,
    currentTimestamp,
    availableDai,
    gsnUnavailable: isGSNUnavailable(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  initializeGsnWallet: (customAction = null) =>
    dispatch(updateModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT })),
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
    doNotCreateOrders
  ) =>
    dispatch(
      placeMarketTrade({
        marketId,
        outcomeId,
        tradeInProgress,
        doNotCreateOrders,
      })
    ),
  orderSubmitted: (type, marketId) => dispatch(orderSubmitted(type, marketId)),
});

const mergeProps = (sP, dP, oP) => {
  const disclaimerSeen = getValueFromlocalStorage(DISCLAIMER_SEEN);
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);

  return {
    ...oP,
    ...sP,
    ...dP,
    disclaimerSeen: !!disclaimerSeen,
    gsnWalletInfoSeen: !!gsnWalletInfoSeen,
  };
};

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Wrapper);

export default WrapperContainer;
