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

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus, modal } = state;
  const { balances } = loginAccount;
  balances.dai = String(totalTradingBalance(loginAccount));
  const signingEthBalance = loginAccount.balances.signerBalances.eth;

  return {
  account: loginAccount.address,
  modal,
  balances,
  signingEthBalance,
  ethToDaiRate: appStatus.ethToDaiRate,
  gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
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
  transferFunds: (amount: string, asset: string, to: string) => {
    dispatch(transferFunds(amount, asset, to));
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  autoClose: sP.autoClose,
  signingEthBalance: sP.signingEthBalance,
  fallBackGasCosts: sP.fallBackGasCosts,
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
  transferFunds: (amount: string, asset: string, to: string) =>
    dP.transferFunds(amount, asset, to),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(TransferForm)
);
