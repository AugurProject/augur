import { connect } from 'react-redux';
import Confirm from 'modules/trading/components/confirm';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import {
  MODAL_INITIALIZE_ACCOUNT,
  CREATEAUGURWALLET,
  TRANSACTIONS,
} from 'modules/common/constants';
import { removePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState, ownProps) => {
  const {
    newMarket,
    pendingQueue,
    loginAccount: { balances, allowance: allowanceBigNumber },
    gsnEnabled: GsnEnabled,
    walletStatus: walletStatus,
    gasPriceInfo,
  } = AppStatus.get();

  const hasFunds = GsnEnabled
    ? !!balances.dai
    : !!balances.eth && !!balances.dai;

  let availableDai = totalTradingBalance();
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  const sweepStatus =
    pendingQueue[TRANSACTIONS]?.[CREATEAUGURWALLET]?.status;
  return {
    gasPrice: gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average,
    availableEth: createBigNumber(balances.eth),
    availableDai,
    hasFunds,
    allowanceBigNumber,
    GsnEnabled,
    walletStatus,
    sweepStatus,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) =>
    AppStatus.actions.setModal({
      customAction,
      type: MODAL_INITIALIZE_ACCOUNT,
    }),
  updateWalletStatus: () => {
    removePendingTransaction(CREATEAUGURWALLET);
  },
});

const ConfirmContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirm);

export default ConfirmContainer;
