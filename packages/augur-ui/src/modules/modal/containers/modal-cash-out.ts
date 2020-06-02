import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CashOutForm } from 'modules/modal/cash-out-form';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  withdrawAllFunds,
  withdrawAllFundsEstimateGas,
} from 'modules/contracts/actions/contractCalls';
import { FormattedNumber } from 'modules/types';
import { getEthReserve } from 'modules/auth/helpers/get-eth-reserve';
import { formatDai, formatEther } from 'utils/format-number';
import { getAccountFunds } from 'modules/auth/helpers/login-account';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { createBigNumber } from 'utils/create-big-number';
import { transferFunds, transferFundsGasEstimate } from 'modules/auth/actions/transfer-funds';
import { DAI } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, ethToDaiRate, modal, gasPriceInfo } = AppStatus.get();
  const { address: account, totalOpenOrdersFrozenFunds } = loginAccount;

  const ethReserveAmount: FormattedNumber = getEthReserve();
  const accountFunds = getAccountFunds(loginAccount);
  const totalOpenOrderFundsFormatted: FormattedNumber = formatDai(totalOpenOrdersFrozenFunds || 0);
  const availableFundsFormatted = formatDai(accountFunds.totalAvailableTradingBalance);
  const reserveInDaiFormatted = ethToDai(ethReserveAmount.value || 0, createBigNumber(ethToDaiRate?.value || 0));
  const totalDaiFormatted = formatDai(createBigNumber(totalOpenOrdersFrozenFunds).plus(createBigNumber(accountFunds.totalAvailableTradingBalance).plus(reserveInDaiFormatted.value)));
  const tradingAccountEthFormatted = formatEther(loginAccount.balances.eth);
  const totalDai = loginAccount.balances.dai;

  return {
    account,
    accountFunds,
    modal,
    ethReserveAmount,
    gasPrice: gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    reserveInDaiFormatted,
    totalDaiFormatted,
    tradingAccountEthFormatted,
    totalDai
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  withdrawAllFunds: (destination: string) => withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => withdrawAllFundsEstimateGas(destination),
  closeModal: () => closeModal(),
  transferFunds: (amount: string, destination: string) => transferFunds(amount, DAI, destination),
  transferFundsGasEstimate: (amount: string, asset: string, to: string) => transferFundsGasEstimate(amount, asset, to),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CashOutForm)
);
