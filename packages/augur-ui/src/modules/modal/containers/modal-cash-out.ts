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

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus, modal } = state;

  const { address } = loginAccount;

  const ethReserveAmount: FormattedNumber = getEthReserve(state);

  return {
    account: address,
    modal,
    GsnEnabled: appStatus.gsnEnabled,
    ethToDaiRate: appStatus.ethToDaiRate,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    ethReserveAmount
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  withdrawAllFunds: (destination: string) => withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => withdrawAllFundsEstimateGas(destination),
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  GsnEnabled: sP.GsnEnabled,
  balances: sP.balances,
  account: sP.account,
  ethReserveAmount: sP.ethReserveAmount,
  ethToDaiRate: sP.ethToDaiRate,
  gasPrice: sP.gasPrice,
  closeAction: () => dP.closeModal(),
  withdrawAllFunds: (destination: string) => dP.withdrawAllFunds(destination),
  withdrawAllFundsEstimateGas: (destination: string) => dP.withdrawAllFundsEstimateGas(destination),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(CashOutForm)
);
