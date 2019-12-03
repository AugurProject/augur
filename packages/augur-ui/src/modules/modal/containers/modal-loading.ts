import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading } from 'modules/modal/loading';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({
  isLogged: state.authStatus.isLogged,
  loginAccount: state.loginAccount,
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any) => ({
  shouldClose: sP.isLogged && sP.loginAccount.meta && !sP.loginAccount.meta.preloaded,
  message: sP.modal.message,
  callback: sP.modal.callback,
  showMetaMaskHelper: sP.modal.showMetaMaskHelper,
  showCloseAfterDelay: sP.modal.showCloseAfterDelay,
  showLearnMore: sP.modal.showLearnMore,
  closeModal: dP.closeModal,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Loading)
);
