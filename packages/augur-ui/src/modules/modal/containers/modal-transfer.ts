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
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: { balances },
    modal,
    gasPriceInfo,
    walletStatus,
    ethToDaiRate,
    gsnEnabled,
  } = AppStatus.get();
  balances.dai = String(totalTradingBalance());
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const signingEthBalance = balances.signerBalances.eth;

  return {
  modal,
  signingEthBalance,
  GsnEnabled: gsnEnabled && walletStatus === WALLET_STATUS_VALUES.CREATED,
  ethToDaiRate,
  gasPrice,
  fallBackGasCosts: {
    eth: TRANSFER_ETH_GAS_COST,
    rep: TRANSFER_REP_GAS_COST,
    dai: TRANSFER_DAI_GAS_COST,
  },
  transactionLabel: getTransactionLabel()
}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) =>
    transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string, useSigner: boolean) => {
    transferFunds(amount, asset, to, useSigner);
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  signingEthBalance: sP.signingEthBalance,
  fallBackGasCosts: sP.fallBackGasCosts,
  gasPrice: sP.gasPrice,
  useSigner: sP.modal?.useSigner ? true : false,
  closeAction: () => {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
  },
  transactionLabel: sP.transactionLabel,
  transferFundsGasEstimate: (amount: string, asset: string, to: string) => dP.transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string, useSigner: boolean) =>
    dP.transferFunds(amount, asset, to, useSigner),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(TransferForm)
);
