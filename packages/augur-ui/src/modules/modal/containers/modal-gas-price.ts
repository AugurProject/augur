import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Gas } from 'modules/modal/gas';
import { closeModal } from 'modules/modal/actions/close-modal';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppStatusActions, AppStatusState } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { gasPriceInfo } = AppStatusState.get();
  return ({
    modal: state.modal,
    ...gasPriceInfo,
  });
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeAction: () => dispatch(closeModal()),
  saveAction: (userDefinedGasPrice: number, average: number) => {
    AppStatusActions.actions.updateGasPriceInfo({ userDefinedGasPrice });
    dispatch(registerUserDefinedGasPriceFunction(userDefinedGasPrice, average));
    dispatch(closeModal());
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
