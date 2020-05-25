import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CashOutForm } from 'modules/modal/cash-out-form';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { withdrawAllFunds, withdrawAllFundsEstimateGas } from 'modules/contracts/actions/contractCalls';
import { FormattedNumber } from 'modules/types';
import { getEthReserve } from 'modules/auth/selectors/get-eth-reserve';
import { formatDai } from 'utils/format-number';
import { selectAccountFunds } from 'modules/auth/selectors/login-account';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { createBigNumber } from 'utils/create-big-number';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus, modal } = state;

  const { address, totalOpenOrdersFrozenFunds } = loginAccount;
  const { ethToDaiRate} = appStatus;

  const ethReserveAmount: FormattedNumber = getEthReserve(state);
  const balances = selectAccountFunds(state);
  const totalOpenOrderFundsFormatted: FormattedNumber = formatDai(totalOpenOrdersFrozenFunds || 0);
  const availableFundsFormatted = formatDai(balances.totalAvailableTradingBalance);
  const reserveInDaiFormatted = ethToDai(ethReserveAmount.value || 0, createBigNumber(ethToDaiRate?.value || 0));
  const totalDaiFormatted = formatDai(createBigNumber(totalOpenOrdersFrozenFunds).plus(createBigNumber(balances.totalAvailableTradingBalance).plus(reserveInDaiFormatted.value)));

  return {
    account: address,
    modal,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    reserveInDaiFormatted,
    totalDaiFormatted,
    transactionLabel: getTransactionLabel(state)
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  withdrawAllFunds: (destination: string) => withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => withdrawAllFundsEstimateGas(destination),
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  closeAction: () => dP.closeModal(),
  withdrawAllFunds: (destination: string) => dP.withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => dP.withdrawAllFundsEstimateGas(destination),
});


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(CashOutForm)
);
