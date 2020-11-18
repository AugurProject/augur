import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SignIn } from 'modules/modal/signin';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateModal } from '../actions/update-modal';
import isMetaMaskPresent from 'modules/auth/helpers/is-meta-mask';
import {
  MODAL_LOGIN,
  MODAL_SIGNUP,
  MODAL_LOADING,
  ACCOUNT_TYPES,
  SIGNIN_LOADING_TEXT,
  SIGNIN_LOADING_TEXT_PORTIS,
  SIGNIN_LOADING_TEXT_TORUS,
  SIGNIN_LOADING_TEXT_FORTMATIC,
  SIGNIN_SIGN_WALLET,
  MODAL_TEST_BET,
  MODAL_ERROR,
  MODAL_HARDWARE_WALLET,
  HELP_CENTER_THIRD_PARTY_COOKIES,
  WALLET_STATUS_VALUES,
  MODAL_AUGUR_USES_DAI,
} from 'modules/common/constants';
import { loginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { loginWithPortis } from 'modules/auth/actions/login-with-portis';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import {
  EmailLogin,
  GoogleLogin,
  PhoneLogin,
  MetaMaskLogin,
} from 'modules/common/icons';
import { windowRef } from 'utils/window-ref';
import { isSafari } from 'utils/is-safari';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  walletStatus: state.appStatus.walletStatus,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  hardwareWalletModal: (isLogin) => dispatch(updateModal({ type: MODAL_HARDWARE_WALLET, isLogin })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  accountCreatedModal: () =>
    dispatch(updateModal({ type: MODAL_AUGUR_USES_DAI })),
  loadingModal: (message, callback, showMetaMaskHelper = false) =>
    dispatch(
      updateModal({
        type: MODAL_LOADING,
        message,
        showMetaMaskHelper,
        callback,
        showCloseAfterDelay: true,
      })
    ),
  connectMetaMask: () => dispatch(loginWithInjectedWeb3()),
  connectPortis: (showRegister) => dispatch(loginWithPortis(showRegister)),
  connectTorus: () =>
    dispatch(loginWithTorus()),
  connectFortmatic: (withEmail) =>
    dispatch(loginWithFortmatic(withEmail)),
  errorModal: (error, title = null, link = null, linkLabel = null) => dispatch(
    updateModal({
      type: MODAL_ERROR,
      title,
      error: error ? error : 'Sorry, please try again.',
      link,
      linkLabel
    })
  ),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const LOGIN_OR_SIGNUP = oP.isLogin ? 'Login' : 'Signup';

  const onError = (error, accountType) => {
    console.error(`ERROR:${accountType}`, error);

    const isPortisCancelError = accountType === ACCOUNT_TYPES.PORTIS && error.message.indexOf('User denied login') !== -1;
    const isFortmaticCancelError =  accountType === ACCOUNT_TYPES.FORTMATIC && error?.message.indexOf('User denied account access') !== -1;
    const isTorusExitCancelError = accountType === ACCOUNT_TYPES.TORUS && error?.message.indexOf('user closed popup') !== -1;

    // If the error we get back from the wallet SDK is "User denied access", aka Cancel/Close wallet window, we should just close the modal
    if (isTorusExitCancelError || isPortisCancelError || isFortmaticCancelError) {
      dP.closeModal();
      return;
    }
    if (error?.message.toLowerCase().indexOf('cookies') !== -1) {
      dP.errorModal(`Please enable cookies in your browser to proceed with ${accountType}.`, 'Cookies are disabled', HELP_CENTER_THIRD_PARTY_COOKIES, 'Learn more.');
    } else {
      dP.errorModal(
        `There was an error while attempting to log in with ${accountType}. Please try again.\n\n${
          error?.message ? `Error: ${JSON.stringify(error.message)}` : ''
        }`
      );
    }
  };

  const login = () => {
    dP.closeModal();
    setTimeout(() => {
      if (LOGIN_OR_SIGNUP === 'Signup') {
        // Kicks off onboarding
        dP.accountCreatedModal();
      }
    });
  };

  const connectMethods = [
    {
      type: ACCOUNT_TYPES.WEB3WALLET,
      icon: MetaMaskLogin,
      text: `${LOGIN_OR_SIGNUP} with ${ACCOUNT_TYPES.WEB3WALLET}`,
      subText: '',
      disabled: false,
      primary: true,
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
    {
      type: ACCOUNT_TYPES.FORTMATIC,
      icon: EmailLogin,
      text: `${LOGIN_OR_SIGNUP} with Email`,
      subText: `Powered by ${ACCOUNT_TYPES.FORTMATIC}`,
      hidden: false,
      primary: !isMetaMaskPresent() ? true : false,
      action: async () => {
        dP.loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => login());
        try {
          await dP.connectFortmatic(false);
        } catch (error) {
          onError(error, ACCOUNT_TYPES.FORTMATIC);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.PORTIS,
      icon: EmailLogin,
      text: `${LOGIN_OR_SIGNUP} with Email`,
      subText: `Powered by ${ACCOUNT_TYPES.PORTIS}`,
      hidden: isSafari() ? true : false,
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
  ];

  return {
    loginModal: dP.loginModal,
    signupModal: dP.signupModal,
    closeModal: dP.closeModal,
    hardwareWalletModal: dP.hardwareWalletModal,
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
