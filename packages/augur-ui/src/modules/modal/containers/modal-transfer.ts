import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransferForm } from 'modules/modal/transfer-form';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { formatGasCostToEther, formatEtherEstimate } from 'utils/format-number';
import {
  transferFunds,
  TRANSFER_ETH_GAS_COST,
  TRANSFER_REP_GAS_COST,
  TRANSFER_DAI_GAS_COST,
  transferFundsGasEstimate,
} from 'modules/auth/actions/transfer-funds';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: { balances, address: account },
    modal,
    gasPriceInfo,
  } = AppStatus.get();
  balances.dai = totalTradingBalance().toNumber();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const signingEthBalance = balances.signerBalances.eth;
  return {
    account,
    modal,
    balances,
    gasPrice,
    signingEthBalance,
    fallBackGasCosts: {
      eth: formatEtherEstimate(
        formatGasCostToEther(
          TRANSFER_ETH_GAS_COST,
          { decimalsRounded: 4 },
          gasPrice
        )
      ),
      rep: formatEtherEstimate(
        formatGasCostToEther(
          TRANSFER_REP_GAS_COST,
          { decimalsRounded: 4 },
          gasPrice
        )
      ),
      dai: formatEtherEstimate(
        formatGasCostToEther(
          TRANSFER_DAI_GAS_COST,
          { decimalsRounded: 4 },
          gasPrice
        )
      ),
    },
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) =>
    transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string) => {
    transferFunds(amount, asset, to);
    closeModal();
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  fallBackGasCosts: sP.fallBackGasCosts,
  balances: sP.balances,
  account: sP.account,
  gasPrice: sP.gasPrice,
  closeAction: () => dP.closeModal(),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) =>
    dP.transferFundsGasEstimate(amount, asset, to),
  transferFunds: (amount: string, asset: string, to: string) =>
    dP.transferFunds(amount, asset, to),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(TransferForm)
);
