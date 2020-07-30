import { connect } from 'react-redux';
import Confirm from 'modules/trading/components/confirm';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { updateModal } from 'modules/modal/actions/update-modal';
import { CREATEAUGURWALLET, TRANSACTIONS, MODAL_ADD_FUNDS } from 'modules/common/constants';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { checkAccountApproval } from 'modules/auth/actions/approve-account';

const mapStateToProps = (state: AppState, ownProps) => {
  const { authStatus, loginAccount, appStatus, newMarket, env } = state;
  const {
    walletStatus: walletStatus,
    ethToDaiRate,
  } = appStatus;

  const hasFunds = !!loginAccount.balances.eth && !!loginAccount.balances.dai;

  let availableDai = totalTradingBalance(loginAccount)
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  const sweepStatus = state.pendingQueue[TRANSACTIONS]?.[CREATEAUGURWALLET]?.status;
  return {
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    availableEth: createBigNumber(loginAccount.balances.eth),
    availableDai,
    ethToDaiRate,
    hasFunds,
    isLogged: authStatus.isLogged,
    tradingApproved: loginAccount.tradingApproved,
    account: loginAccount.address,
    walletStatus,
    sweepStatus,
    disableTrading: process.env.REPORTING_ONLY,
    affiliate: loginAccount?.affiliate,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateWalletStatus: () => {
    dispatch(removePendingTransaction(CREATEAUGURWALLET));
  },
  showAddFundsModal: (modal) => dispatch(updateModal({ type: MODAL_ADD_FUNDS, ...modal })),
  checkAccountApproval: () => dispatch(checkAccountApproval())
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
