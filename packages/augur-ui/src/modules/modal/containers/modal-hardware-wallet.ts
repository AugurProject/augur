import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { HardwareWallet } from 'modules/modal/hardware-wallet';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_LOGIN,
  MODAL_SIGNUP,
} from 'modules/common/constants';
import { LOGIN, SIGNUP } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  return {
    loginModal: dP.loginModal,
    signupModal: dP.signupModal,
    closeModal: dP.closeModal,
    loginOrSignup: oP.modal.isLogin ? LOGIN : SIGNUP,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(HardwareWallet)
);
