import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransferForm } from 'modules/modal/transfer-form';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import {
  transferFunds,
  TRANSFER_ETH_GAS_COST,
  TRANSFER_REP_GAS_COST,
  TRANSFER_DAI_GAS_COST,
  transferFundsGasEstimate,
} from 'modules/auth/actions/transfer-funds';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';
import { WALLET_STATUS } from 'modules/app/actions/update-app-status';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus, modal } = state;
  const { balances } = loginAccount;
  const walletStatus = appStatus[WALLET_STATUS];
  balances.dai = String(totalTradingBalance(loginAccount));
  const gasPrice = state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average;
  const signingEthBalance = loginAccount.balances.signerBalances.eth;

  return {
  account: loginAccount.address,
  modal,
  balances,
  signingEthBalance,
  GsnEnabled: appStatus.gsnEnabled && walletStatus === WALLET_STATUS_VALUES.CREATED,
  ethToDaiRate: appStatus.ethToDaiRate,
  gasPrice,
  fallBackGasCosts: {
    eth: TRANSFER_ETH_GAS_COST,
    rep: TRANSFER_REP_GAS_COST,
    dai: TRANSFER_DAI_GAS_COST,
  },
  transactionLabel: getTransactionLabel(state),
  autoClose: modal?.autoClose,
}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) =>
    transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string, useSigner: boolean, useTopOff: boolean) => {
    dispatch(transferFunds(amount, asset, to, useSigner, useTopOff));
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  autoClose: sP.autoClose,
  signingEthBalance: sP.signingEthBalance,
  fallBackGasCosts: sP.fallBackGasCosts,
  GsnEnabled: sP.GsnEnabled,
  ethToDaiRate: sP.ethToDaiRate,
  balances: sP.balances,
  account: sP.account,
  gasPrice: sP.gasPrice,
  useSigner: sP.modal?.useSigner ? true : false,
  tokenName: sP.modal?.tokenName,
  closeAction: () => {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
  },
  transactionLabel: sP.transactionLabel,
  transferFundsGasEstimate: (amount: string, asset: string, to: string) => dP.transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string, useSigner: boolean, useTopOff: boolean) =>
    dP.transferFunds(amount, asset, to, useSigner, useTopOff),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(TransferForm)
);
