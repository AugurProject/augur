import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Connect } from 'modules/modal/connect';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_LOGIN,
  MODAL_SIGNUP,
  MODAL_LOADING,
  ACCOUNT_TYPES,
  SIGNIN_LOADING_TEXT,
  SIGNIN_SIGN_WALLET,
  SIGNIN_LOADING_TEXT_PORTIS,
  SIGNIN_LOADING_TEXT_TORUS,
  SIGNIN_LOADING_TEXT_FORTMATIC,
  MODAL_ERROR,
} from 'modules/common/constants';
import { loginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithPortis } from 'modules/auth/actions/login-with-portis';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import isMetaMaskPresent from 'modules/auth/helpers/is-meta-mask';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { windowRef } from 'utils/window-ref';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  loadingModal: (message, callback, showMetaMaskHelper = false) =>
    dispatch(
      updateModal({
        type: MODAL_LOADING,
        message,
        showMetaMaskHelper,
        callback,
      })
    ),
  connectMetaMask: () => dispatch(loginWithInjectedWeb3()),
  connectPortis: () =>
    dispatch(loginWithPortis(false)),
  connectTorus: () =>
    dispatch(loginWithTorus()),
  connectFortmatic: () =>
    dispatch(loginWithFortmatic()),
  errorModal: (error) => dispatch(
    updateModal({
      type: MODAL_ERROR,
      error: error ? JSON.stringify(error) : ''
    })
  ),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const onError = (error, accountType) => {
    console.error(`ERROR:${accountType}`, error);
    dP.errorModal(error);
  };

  const redirect = () => {
    setTimeout(() => {
      dP.closeModal();
      oP.history.push({ pathname: makePath(MARKETS, null) });
    });
  };

  const connectMethods = [
    {
      type: ACCOUNT_TYPES.PORTIS,
      hidden: false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_PORTIS, () => redirect());
        try {
          await dP.connectPortis();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.PORTIS);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.TORUS,
      hidden: false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_TORUS, () => redirect());
        try {
          await dP.connectTorus();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.TORUS);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.FORTMATIC,
      hidden: false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => redirect());
        try {
          await dP.connectFortmatic();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.FORTMATIC);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.WEB3WALLET,
      disabled: false,
      hidden: !isMetaMaskPresent(),
      action: async () => {
        const accounts =
          windowRef.ethereum && windowRef.ethereum.selectedAddress;
        const msg = accounts ? SIGNIN_LOADING_TEXT : SIGNIN_SIGN_WALLET;
        dP.loadingModal(msg, () => redirect(), accounts ? false : true);
        try {
          await dP.connectMetaMask();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.WEB3WALLET);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.EDGE,
      hidden: false,
      disabled: true,
      action: () => null,
    },
    {
      type: ACCOUNT_TYPES.LEDGER,
      hidden: false,
      disabled: true,
      action: () => null,
    },
    {
      type: ACCOUNT_TYPES.TREZOR,
      hidden: false,
      disabled: true,
      action: () => null,
    },
  ];

  return {
    signupModal: dP.signupModal,
    loginModal: dP.loginModal,
    loginOrSignup: sP.modal.loginOrSignup ? sP.modal.loginOrSignup : null,
    closeModal: dP.closeModal,
    connectMethods,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Connect)
);
