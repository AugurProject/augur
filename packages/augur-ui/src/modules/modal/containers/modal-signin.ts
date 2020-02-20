import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SignIn } from 'modules/modal/signin';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { approveToTrade } from 'modules/contracts/actions/contractCalls';
import { updateModal } from '../actions/update-modal';
import isMetaMaskPresent from 'modules/auth/helpers/is-meta-mask';
import {
  MODAL_LOGIN,
  MODAL_SIGNUP,
  MODAL_CONNECT,
  MODAL_LOADING,
  ACCOUNT_TYPES,
  SIGNIN_LOADING_TEXT_PORTIS,
  SIGNIN_LOADING_TEXT,
  SIGNIN_LOADING_TEXT_TORUS,
  SIGNIN_LOADING_TEXT_FORTMATIC,
  SIGNIN_SIGN_WALLET,
  ONBOARDING_SEEN_KEY,
  MODAL_ACCOUNT_CREATED,
  MODAL_ERROR,
} from 'modules/common/constants';
import { loginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithPortis } from 'modules/auth/actions/login-with-portis';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import {
  EmailLogin,
  GoogleLogin,
  PhoneLogin,
  MetaMaskLogin,
} from 'modules/common/icons';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { windowRef } from 'utils/window-ref';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  // approveAccount: () => approveToTrade(),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  connectModal: loginOrSignup =>
    dispatch(updateModal({ type: MODAL_CONNECT, loginOrSignup })),
  accountCreatedModal: () =>
    dispatch(updateModal({ type: MODAL_ACCOUNT_CREATED })),
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
  connectPortis: (showRegister) =>
    dispatch(loginWithPortis(showRegister)),
  connectTorus: () =>
    dispatch(loginWithTorus()),
  connectFortmatic: () =>
    dispatch(loginWithFortmatic()),
  errorModal: (error) => dispatch(
    updateModal({
      type: MODAL_ERROR,
      error: JSON.stringify(error)
    })
  ),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const LOGIN_OR_SIGNUP = oP.isLogin ? 'Login' : 'Signup';

  const onError = (error, accountType) => {
    console.error(`ERROR:${accountType}`, error);
    dP.errorModal(error);
  };

  const login = () => {
    setTimeout(() => {
      dP.closeModal();

      const showOnboardingSeen = windowRef.localStorage.getItem(ONBOARDING_SEEN_KEY);
      if (LOGIN_OR_SIGNUP === 'Signup' &&!showOnboardingSeen) {
        // Kicks off onboarding
        dP.accountCreatedModal();
      }
    });
  };

  const connectMethods = [
    {
      type: ACCOUNT_TYPES.PORTIS,
      icon: EmailLogin,
      text: `${LOGIN_OR_SIGNUP} with Email`,
      subText: `Powered by ${ACCOUNT_TYPES.PORTIS}`,
      hidden: false,
      primary: true,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_PORTIS, () => login());
        try {
          const forceRegisterPage = oP.isLogin ? false : true;
          await dP.connectPortis(forceRegisterPage);
        } catch (error) {
          onError(error, ACCOUNT_TYPES.PORTIS);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.TORUS,
      icon: GoogleLogin,
      text: `${LOGIN_OR_SIGNUP} with Google`,
      subText: `Powered by ${ACCOUNT_TYPES.TORUS}`,
      hidden: false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_TORUS, () => login());
        try {
          await dP.connectTorus();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.TORUS);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.FORTMATIC,
      icon: PhoneLogin,
      text: `${LOGIN_OR_SIGNUP} with Phone Number`,
      subText: `Powered by ${ACCOUNT_TYPES.FORTMATIC}`,
      hidden: false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => login());
        try {
          await dP.connectFortmatic();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.FORTMATIC);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.WEB3WALLET,
      icon: MetaMaskLogin,
      text: `${LOGIN_OR_SIGNUP} with ${ACCOUNT_TYPES.WEB3WALLET}`,
      subText: '',
      disabled: false,
      hidden: !isMetaMaskPresent(),
      action: async () => {
        const accounts =
          windowRef.ethereum && windowRef.ethereum.selectedAddress;
        const msg = accounts ? SIGNIN_LOADING_TEXT : SIGNIN_SIGN_WALLET;
        const showMetaMaskHelper = accounts ? false : true;
        dP.loadingModal(msg, () => login(), showMetaMaskHelper);
        try {
          await dP.connectMetaMask();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.WEB3WALLET);
        }
      },
    },
  ];

  return {
    loginModal: dP.loginModal,
    signupModal: dP.signupModal,
    connectModal: dP.connectModal,
    closeModal: dP.closeModal,
    isLogin: oP.isLogin,
    connectMethods,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(SignIn)
);
