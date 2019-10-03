import React from 'react';

import { SecondaryButton } from 'modules/common/buttons';
import { Close, BackArrow } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { LOGIN, SIGNUP } from 'modules/common/constants';

interface ConnectMethod {
  hidden: boolean;
  disabled: boolean;
  action: Function;
  type: string;
}

interface ConnectProps {
  closeModal: Function;
  loginModal: Function;
  signupModal: Function;
  loginOrSignup: 'login' | 'signup';
  connectMethods: ConnectMethod[];
}

export const Connect = ({
  closeModal,
  loginModal,
  signupModal,
  connectMethods,
  loginOrSignup,
}: ConnectProps) => {
  const buttonsToShow = connectMethods
    .filter(method => !method.hidden)
    .map((method, idx) => (
      <SecondaryButton
        key={idx}
        disabled={method.disabled ? true : false}
        action={method.action}
        text={method.type}
      />
    ));

  return (
    <div className={Styles.Connect}>
      {loginOrSignup && loginOrSignup === LOGIN && (
        <div onClick={() => loginModal()}>
          {BackArrow} {'Back'}
        </div>
      )}
      {loginOrSignup && loginOrSignup === SIGNUP && (
        <div onClick={() => signupModal()}>
          {BackArrow} {'Back'}
        </div>
      )}
      <div onClick={() => closeModal()}>
        {Close}
      </div>
      <header>
        <div>Connect a wallet</div>
        <div>
          If you already have an Augur supported wallet you can use it to login.
        </div>
      </header>
      {buttonsToShow}
    </div>
  );
};
