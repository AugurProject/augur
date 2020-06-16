import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MigrateRep } from 'modules/modal/migrate-rep';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  convertV1ToV2Estimate,
  approveAndConvertV1ToV2,
} from 'modules/account/actions/convert-v1-rep-to-v2';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  GsnEnabled: state.appStatus.gsnEnabled,
  gasPrice:
    state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
  walletBalances: state.loginAccount.balances,
  tradingAccount: state.loginAccount.address,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  convertV1ToV2: useSigningWallet =>
    dispatch(approveAndConvertV1ToV2(useSigningWallet)),
  convertV1ToV2Estimate: useSigningWallet =>
    convertV1ToV2Estimate(useSigningWallet),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  ...dP,
  closeAction: () => dP.closeModal(),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(MigrateRep)
);
