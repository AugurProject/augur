import React from 'react';
import {
  PrimarySignInButton,
  SecondarySignInButton,
} from 'modules/common/buttons';
import {
  Close,
  EmailLogin,
  GoogleLogin,
  PhoneLogin,
  MetaMaskLogin,
} from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MODAL_LOGIN,
  MODAL_HARDWARE_WALLET,
  MODAL_SIGNUP,
  MODAL_ACCOUNT_CREATED,
  MODAL_LOADING,
  MODAL_ERROR,
  ACCOUNT_TYPES,
  HELP_CENTER_THIRD_PARTY_COOKIES,
  SIGNIN_LOADING_TEXT_TORUS,
  SIGNIN_LOADING_TEXT_FORTMATIC,
  SIGNIN_LOADING_TEXT,
  SIGNIN_SIGN_WALLET,
} from 'modules/common/constants';
import { loginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { windowRef } from 'utils/window-ref';
import isMetaMaskPresent from 'modules/auth/helpers/is-meta-mask';

export const SignIn = ({ isLogin }) => {
  const {
    modal,
    actions: { closeModal, setModal },
  } = useAppStatusStore();
  const loginModal = () => setModal({ type: MODAL_LOGIN });
  const hardwareWalletModal = isLogin =>
    setModal({ type: MODAL_HARDWARE_WALLET, isLogin });
  const signupModal = () => setModal({ type: MODAL_SIGNUP });
  const accountCreatedModal = () => setModal({ type: MODAL_ACCOUNT_CREATED });
  const loadingModal = (message, callback, showMetaMaskHelper = false) => {
    setModal({
      type: MODAL_LOADING,
      message,
      showMetaMaskHelper,
      callback,
      showCloseAfterDelay: true,
    });
  };

  const connectMetaMask = () => loginWithInjectedWeb3();
  const connectTorus = () => loginWithTorus();
  const connectFortmatic = (withEmail) => loginWithFortmatic(withEmail);
  const errorModal = (error, title = null, link = null, linkLabel = null) =>
    setModal({
      type: MODAL_ERROR,
      title,
      error: error ? error : 'Sorry, please try again.',
      link,
      linkLabel,
    });

  const LOGIN_OR_SIGNUP = isLogin ? 'Login' : 'Signup';

  const onError = (error, accountType) => {
    console.error(`ERROR:${accountType}`, error);

    const isFortmaticCancelError =
      accountType === ACCOUNT_TYPES.FORTMATIC &&
      error.message.indexOf('User denied account access') !== -1;
    const isTorusExitCancelError =
      accountType === ACCOUNT_TYPES.TORUS &&
      error.indexOf('user closed popup') !== -1;

    // If the error we get back from the wallet SDK is "User denied access", aka Cancel/Close wallet window, we should just close the modal
    if (
      isTorusExitCancelError ||
      isFortmaticCancelError
    ) {
      closeModal();
      return;
    }
    if (error?.message.toLowerCase().indexOf('cookies') !== -1) {
      errorModal(
        `Please enable cookies in your browser to proceed with ${accountType}.`,
        'Cookies are disabled',
        HELP_CENTER_THIRD_PARTY_COOKIES,
        'Learn more.'
      );
    } else {
      errorModal(
        `There was an error while attempting to log in with ${accountType}. Please try again.\n\n${
          error?.message ? `Error: ${JSON.stringify(error.message)}` : ''
        }`
      );
    }
  };

  const login = () => {
    setTimeout(() => {
      closeModal();

      if (LOGIN_OR_SIGNUP === 'Signup') {
        // Kicks off onboarding
        accountCreatedModal();
      }
    });
  };

  const connectMethods = [
    {
      // type: ACCOUNT_TYPES.PORTIS,
      icon: EmailLogin,
      text: `${LOGIN_OR_SIGNUP} with Email`,
      subText: `Powered by ${ACCOUNT_TYPES.FORTMATIC}`,
      hidden: false,
      primary: true,
      action: async () => {
        loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => login());
        try {
          await connectFortmatic(true);
        } catch (error) {
          onError(error, ACCOUNT_TYPES.FORTMATIC);
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
        loadingModal(SIGNIN_LOADING_TEXT_TORUS, () => login());
        try {
          await connectTorus();
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
        loadingModal(SIGNIN_LOADING_TEXT_FORTMATIC, () => login());
        try {
          await connectFortmatic(false);
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
        loadingModal(msg, () => login(), showMetaMaskHelper);
        try {
          await connectMetaMask();
          login();
        } catch (error) {
          onError(error, ACCOUNT_TYPES.WEB3WALLET);
        }
      },
    },
  ];

  const parimaryButtonsToShow = connectMethods
    .filter(method => !method.hidden)
    .filter(method => method.primary)
    .map((method, idx) => (
      <PrimarySignInButton
        key={idx}
        action={() => method.action()}
        text={method.text}
        subText={method.subText}
        icon={method.icon}
      />
    ));

  const secondaryButtonsToShow = connectMethods
    .filter(method => !method.hidden)
    .filter(method => !method.primary)
    .map((method, idx) => (
      <SecondarySignInButton
        key={idx}
        action={() => method.action()}
        text={method.text}
        subText={method.subText}
        icon={method.icon}
      />
    ));

  return (
    <div className={Styles.SignIn}>
      <div onClick={() => closeModal()}>{Close}</div>
      <header>
        <div>{LOGIN_OR_SIGNUP}</div>
        {isLogin ? (
          <div>
            New to Augur? <span onClick={() => signupModal()}>Signup</span>
          </div>
        ) : (
          <div>
            Already an Augur user?{' '}
            <span onClick={() => loginModal()}>Login</span>
          </div>
        )}
      </header>

      {parimaryButtonsToShow}

      <div>OR</div>

      {secondaryButtonsToShow}

      <footer>
        <div>
          Want to use a hardware wallet?
          <span onClick={() => hardwareWalletModal(isLogin)}>Learn more</span>
        </div>
      </footer>
    </div>
  );
};
