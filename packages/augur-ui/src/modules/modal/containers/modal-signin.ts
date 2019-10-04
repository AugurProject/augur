import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SignIn } from 'modules/modal/signin';
import { AppState } from 'store';
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
import { MARKETS, LANDING_PAGE } from 'modules/routes/constants/views';
import { windowRef } from 'utils/window-ref';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  account: state.loginAccount,
  isLogged: state.authStatus.isLogged,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: () => approveToTrade(),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  connectModal: loginOrSignup =>
    dispatch(updateModal({ type: MODAL_CONNECT, loginOrSignup })),
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
  connectPortis: (showRegister, showConnectingModal) =>
    dispatch(loginWithPortis(showRegister, showConnectingModal)),
  connectTorus: showConnectingModal =>
    dispatch(loginWithTorus(showConnectingModal)),
  connectFortmatic: showConnectingModal =>
    dispatch(loginWithFortmatic(showConnectingModal)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const LOGIN_OR_SIGNUP = oP.isLogin ? 'Login' : 'Signup';

  const onError = (error, accountType) => {
    console.error(`ERROR:${accountType}`, error);
    dP.closeModal();
  };

  const showConnectingModal = () =>
    dP.loadingModal(SIGNIN_LOADING_TEXT, () => redirect());

  const redirect = () => {
    dP.closeModal();

    if (oP.isLogin) {
      oP.history.push({ pathname: makePath(MARKETS, null) });
    } else {
      oP.history.push({ pathname: makePath(LANDING_PAGE, null) });
    }
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
        dP.loadingModal(SIGNIN_LOADING_TEXT_PORTIS, () => redirect());
        try {
          const forceRegisterPage = oP.isLogin ? false : true;
          await dP.connectPortis(forceRegisterPage, () =>
            showConnectingModal()
          );
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
        dP.loadingModal(SIGNIN_LOADING_TEXT_TORUS, () => redirect());
        try {
          await dP.connectTorus(() => showConnectingModal());
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
        dP.loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => redirect());
        try {
          await dP.connectFortmatic(() => showConnectingModal());
        } catch (error) {
          onError(error, ACCOUNT_TYPES.FORTMATIC);
        }
      },
    },
    {
      type: ACCOUNT_TYPES.METAMASK,
      icon: MetaMaskLogin,
      text: `${LOGIN_OR_SIGNUP} with ${ACCOUNT_TYPES.METAMASK}`,
      subText: `Powered by ${ACCOUNT_TYPES.METAMASK}`,
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
          onError(error, ACCOUNT_TYPES.METAMASK);
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
