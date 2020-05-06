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
import { formatDai } from 'utils/format-number';
import { getAccountFunds, getEthReserve } from 'modules/auth/helpers/login-account';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount,
    gasPriceInfo,
    modal,
  } = AppStatus.get();
  const { address: account, totalOpenOrdersFrozenFunds } = loginAccount;
  const ethReserveAmount: FormattedNumber = getEthReserve();
  const balances = getAccountFunds(loginAccount);
  const totalOpenOrderFundsFormatted: FormattedNumber = formatDai(
    totalOpenOrdersFrozenFunds || 0
  );
  const availableFundsFormatted = formatDai(
    balances.totalAvailableTradingBalance
  );

  return {
    account,
    modal,
    gasPrice: gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    ethReserveAmount,
    balances,
    totalOpenOrdersFrozenFunds,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  withdrawAllFunds: (destination: string) => withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) =>
    withdrawAllFundsEstimateGas(destination),
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  closeAction: () => dP.closeModal(),
  withdrawAllFunds: (destination: string) => dP.withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) =>
    dP.withdrawAllFundsEstimateGas(destination),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(CashOutForm)
);
