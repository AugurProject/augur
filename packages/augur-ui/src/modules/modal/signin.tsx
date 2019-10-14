import React, { useState, useEffect } from 'react';
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
  connectModal: Function;
  isLogin: boolean;
  connectMethods: ConnectMethod[];
}

export const SignIn = (props: LoginProps) => {
  const {
    closeModal,
    signupModal,
    loginModal,
    connectModal,
    isLogin = true,
    connectMethods,
  } = props;

  const LOGIN_OR_SIGNUP = isLogin ? 'Login' : 'Signup';

  const [isGnosis, setIsGnosis] = useState(
    Boolean(window.localStorage.getItem('isGnosis'))
  );

  useEffect(() => {
    if (isGnosis) {
      window.localStorage.setItem('isGnosis', 'true');
    } else {
      window.localStorage.removeItem('isGnosis');
    }
  }, [isGnosis]);

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
          Want to use a different wallet?{' '}
          <span onClick={() => connectModal(isLogin ? 'login' : 'signup')}>
            Connect
          </span>
        </div>

        <div
          title='Gnosis safe is under development'
          onClick={() => setIsGnosis(!isGnosis)}
        >
          Use Gnosis Safe ⚠️
          <input type='checkbox' readOnly checked={isGnosis ? true : false} />
        </div>
      </footer>
    </div>
  );
};
