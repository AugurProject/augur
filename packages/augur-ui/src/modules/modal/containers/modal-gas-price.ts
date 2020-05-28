import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Gas } from 'modules/modal/gas';
import { closeModal } from 'modules/modal/actions/close-modal';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { gasPriceInfo, modal } = AppStatus.get();
  return ({
    modal,
    ...gasPriceInfo,
  });
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeAction: () => closeModal(),
  saveAction: (userDefinedGasPrice: number, average: number) => {
    AppStatus.actions.updateGasPriceInfo({ userDefinedGasPrice });
    dispatch(registerUserDefinedGasPriceFunction(userDefinedGasPrice, average));
    closeModal();
  },
});

const mergeProps = (sP: any, dP: any) => ({
  ...sP,
  closeAction: dP.closeAction,
  saveAction: dP.saveAction,
  feeTooLow: sP.modal.feeTooLow,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Gas)
);
