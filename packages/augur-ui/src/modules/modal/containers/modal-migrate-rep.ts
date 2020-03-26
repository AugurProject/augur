import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MigrateRep } from 'modules/modal/migrate-rep';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import convertV1ToV2, {
  convertV1ToV2Estimate,
} from 'modules/account/actions/convert-v1-rep-to-v2';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  loginAccount: state.loginAccount,
  GsnEnabled: state.appStatus.gsnEnabled,
  gasPrice: getGasPrice(state),
  walletBalances: state.loginAccount.balances,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  convertV1ToV2: () => dispatch(convertV1ToV2()),
  convertV1ToV2Estimate: () => convertV1ToV2Estimate(),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const showForSafeWallet = sP.walletBalances.legacyRep > 0;

  return {
    ...dP,
    loginAccount: sP.loginAccount,
    GsnEnabled: sP.GsnEnabled,
    gasPrice: sP.gasPrice,
    closeAction: () => dP.closeModal(),
    showForSafeWallet,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MigrateRep)
);
