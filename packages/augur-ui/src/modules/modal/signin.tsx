import React from 'react';
import {
  PrimarySignInButton,
  SecondarySignInButton,
} from 'modules/common/buttons';
import { Close } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';

interface ConnectMethod {
  hidden: boolean;
  disabled: boolean;
  action: Function;
  type: string;
  text: string;
  subText: string;
  icon: React.ReactFragment;
  primary: boolean;
}

interface LoginProps {
  closeModal: Function;
  signupModal: Function;
  loginModal: Function;
  hardwareWalletModal: Function;
  isLogin: boolean;
  connectMethods: ConnectMethod[];
}

export const SignIn = (props: LoginProps) => {
  const {
    closeModal,
    signupModal,
    loginModal,
    hardwareWalletModal,
    isLogin = true,
    connectMethods,
  } = props;

  const LOGIN_OR_SIGNUP = isLogin ? 'Login' : 'Signup';

  const parimaryButtonsToShow = connectMethods
    .filter(method => !method.hidden)
    .filter(method => method.primary)
    .map((method, idx) => (
      <PrimarySignInButton
        key={idx}
        action={method.action}
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
        action={method.action}
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
          Want to use a hardware wallet?{' '}
          <span onClick={() => hardwareWalletModal(isLogin)}>
            Learn more
          </span>
        </div>
      </footer>
    </div>
  );
};
