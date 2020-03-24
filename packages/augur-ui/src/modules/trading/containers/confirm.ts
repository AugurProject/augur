import { connect } from 'react-redux';
import Confirm from 'modules/trading/components/confirm';
import { createBigNumber } from 'utils/create-big-number';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'store';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_INITIALIZE_ACCOUNT, CREATEAUGURWALLET, TRANSACTIONS } from 'modules/common/constants';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';

const mapStateToProps = (state: AppState, ownProps) => {
  const { authStatus, loginAccount, appStatus, newMarket } = state;
  const {
    gsnEnabled: GsnEnabled,
    walletStatus: walletStatus,
  } = appStatus;

  const hasFunds = GsnEnabled
    ? !!loginAccount.balances.dai
    : !!loginAccount.balances.eth && !!loginAccount.balances.dai;

  let availableDai = totalTradingBalance(loginAccount)
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  const sweepStatus = state.pendingQueue[TRANSACTIONS]?.[CREATEAUGURWALLET]?.status;
  return {
    gasPrice: getGasPrice(state),
    availableEth: createBigNumber(loginAccount.balances.eth),
    availableDai,
    hasFunds,
    isLogged: authStatus.isLogged,
    allowanceBigNumber: loginAccount.allowance,
    GsnEnabled,
    walletStatus,
    sweepStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  initializeGsnWallet: () => dispatch(updateModal({ type: MODAL_INITIALIZE_ACCOUNT })),
  updateWalletStatus: () => {
    dispatch(removePendingTransaction(CREATEAUGURWALLET));
  }
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const ConfirmContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Confirm);

export default ConfirmContainer;
