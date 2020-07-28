import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CashOutForm } from 'modules/modal/cash-out-form';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { withdrawAllFundsEstimateGas } from 'modules/contracts/actions/contractCalls';
import { FormattedNumber } from 'modules/types';
import { getEthReserve } from 'modules/auth/selectors/get-eth-reserve';
import { formatDaiPrice, formatEther, formatDai } from 'utils/format-number';
import { selectAccountFunds } from 'modules/auth/selectors/login-account';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { createBigNumber } from 'utils/create-big-number';
import { transferFunds, transferFundsGasEstimate, withdrawTransfer } from 'modules/auth/actions/transfer-funds';
import { DAI } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus, modal } = state;

  const { address, totalOpenOrdersFrozenFunds } = loginAccount;
  const { ethToDaiRate} = appStatus;

  const ethReserveAmount: FormattedNumber = getEthReserve(state);
  const accountFunds = selectAccountFunds(state);
  const totalOpenOrderFundsFormatted: FormattedNumber = formatDai(totalOpenOrdersFrozenFunds || 0);
  const availableFundsFormatted = formatDai(accountFunds.totalAvailableTradingBalance);
  const reserveInDaiFormatted = ethToDai(ethReserveAmount.value || 0, createBigNumber(ethToDaiRate?.value || 0));
  const totalDaiFormatted = formatDai(createBigNumber(totalOpenOrdersFrozenFunds).plus(createBigNumber(accountFunds.totalAvailableTradingBalance).plus(reserveInDaiFormatted.value)));
  const tradingAccountEthFormatted = formatEther(loginAccount.balances.eth);
  const totalDai = loginAccount.balances.dai;
  const signerEth = loginAccount.balances.signerBalances.eth;

  return {
    account: address,
    modal,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    reserveInDaiFormatted,
    totalDaiFormatted,
    tradingAccountEthFormatted,
    totalDai,
    signerEth,
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  withdrawAllFunds: (destination: string) => dispatch(withdrawTransfer(destination)),
  withdrawAllFundsEstimateGas: (destination: string) => withdrawAllFundsEstimateGas(destination),
  closeModal: () => dispatch(closeModal()),
  transferFunds: (amount: string, destination: string) => dispatch(transferFunds(amount, DAI, destination, false, false)),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) => transferFundsGasEstimate(amount, asset, to),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  closeAction: () => dP.closeModal(),
  withdrawAllFunds: (destination: string) => dP.withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => dP.withdrawAllFundsEstimateGas(destination),
  transferFunds: (amount: string, destination: string) => dP.transferFunds(amount, destination),
  transferFundsGasEstimate: (amount: string, destination: string) => dP.transferFundsGasEstimate(amount, DAI, destination),
});


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(CashOutForm)
);
