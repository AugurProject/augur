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
import getGasPrice from 'modules/auth/helpers/get-gas-price';
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
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { AppStatus } from 'modules/app/store/app-status';

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
    newMarket,
    accountPositions,
    userOpenOrders,
    loginAccount: {
      balances: { dai, eth },
    },
    gsnEnabled,
    isLogged,
    restoredAccount,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  const marketId = ownProps.market.id;
  const hasHistory = !!accountPositions[marketId] || !!userOpenOrders[marketId];
  const hasFunds = gsnEnabled ? !!dai : !!eth && !!dai;

  let availableDai = totalTradingBalance();
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  const disclaimerSeen = getValueFromlocalStorage(DISCLAIMER_SEEN);
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);
  return {
    hasHistory,
    gasPrice: getGasPrice(),
    hasFunds,
    isLogged,
    restoredAccount,
    currentTimestamp,
    availableDai,
    gsnUnavailable: isGSNUnavailable(),
    endTime: ownProps.initialLiquidity
      ? newMarket.setEndTime
      : ownProps.market.endTime,
    disclaimerSeen: !!disclaimerSeen,
    gsnWalletInfoSeen: !!gsnWalletInfoSeen,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { setModal } = AppStatus.actions;
  return {
    initializeGsnWallet: (customAction = null) =>
      setModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT }),
    handleFilledOnly: trade => null,
    updateTradeCost: (marketId, outcomeId, order, callback) =>
      updateTradeCost({ marketId, outcomeId, ...order, callback }),
    updateTradeShares: (marketId, outcomeId, order, callback) =>
      updateTradeShares({ marketId, outcomeId, ...order, callback }),
    disclaimerModal: modal =>
      setModal({
        type: MODAL_DISCLAIMER,
        ...modal,
      }),
    addFundsModal: () => setModal({ type: MODAL_ADD_FUNDS }),
    loginModal: () =>
      setModal({
        type: MODAL_LOGIN,
        pathName: getMarketPath(ownProps.market.id),
      }),
    signupModal: () =>
      setModal({
        type: MODAL_SIGNUP,
        pathName: getMarketPath(ownProps.market.id),
      }),
    onSubmitPlaceTrade: (
      marketId,
      outcomeId,
      tradeInProgress,
      doNotCreateOrders
    ) =>
      placeMarketTrade({
        marketId,
        outcomeId,
        tradeInProgress,
        doNotCreateOrders,
      }),
    orderSubmitted: (type, marketId) => orderSubmitted(type, marketId),
  };
};

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper);

export default WrapperContainer;
