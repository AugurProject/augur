import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MigrateRep } from 'modules/modal/migrate-rep';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import convertV1ToV2, { convertV1ToV2Estimate } from 'modules/account/actions/convert-v1-rep-to-v2';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  loginAccount: state.loginAccount,
  Gnosis_ENABLED: state.appStatus.gnosisEnabled,
  ethToDaiRate: state.appStatus.ethToDaiRate,
  gasPrice: getGasPrice(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  convertV1ToV2: () => dispatch(convertV1ToV2()),
  convertV1ToV2Estimate: () => convertV1ToV2Estimate(),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...dP,
  loginAccount: sP.loginAccount,
  ethToDaiRate: sP.ethToDaiRate,
  Gnosis_ENABLED: sP.Gnosis_ENABLED,
  gasPrice: sP.gasPrice,
  closeAction: () => dP.closeModal(),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MigrateRep)
);
