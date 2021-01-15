import React, {ReactElement, useEffect} from 'react';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {Activity as NetworkIcon} from 'react-feather';
import {ethers} from 'ethers';
import {SecondaryButton} from '../common/buttons';
import classNames from 'classnames';
import ButtonStyles from 'modules/common/buttons.styles.less';
import {GetWalletIcon} from 'modules/common/get-wallet-icon';
import {useActiveWeb3React} from 'modules/ConnectAccount/hooks';
import {MODAL_CONNECT_WALLET} from 'modules/constants';
import {useAppStatusStore} from 'modules/stores/app-status';
import {tryAutoLogin} from 'modules/ConnectAccount/utils';

interface LoginButtonProps {
  action: Function;
  text: string;
  icon: ReactElement;
  darkMode: boolean;
  className: string;
}

const LoginButton = ({ action, text, icon, darkMode, className }: LoginButtonProps) => (
  <SecondaryButton
    action={action}
    text={text}
    icon={icon}
    className={classNames({
      'dark-mode': darkMode,
    }, className)}
  />
);

const shortenAddress = (address: string, chars = 4): string => {
  const isAddress = value => {
    try {
      return ethers.utils.getAddress(value.toLowerCase())
    } catch {
      return false
    }
  }
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

const ConnectAccountButton = ({ autoLogin, updateLoginAccount, darkMode, transactions }) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const { account, activate, connector, error } = useWeb3React();
  const activeWeb3 = useActiveWeb3React();

  useEffect(() => {
    if (autoLogin && !account) tryAutoLogin(activate);
  }, [autoLogin]);

  useEffect(() => {
    if (account) {
      updateLoginAccount(activeWeb3);
    }
    // eslint-disable-next-line
  }, [account, activeWeb3]);

  let buttonProps = {
    action: () => setModal({
      type: MODAL_CONNECT_WALLET,
      darkMode,
      autoLogin,
      transactions,
    }),
    className: null,
    darkMode,
    icon: null,
    text: 'Connect Wallet',
  };

  if (account) {
    buttonProps = {
      ...buttonProps,
      text: shortenAddress(account),
      icon: connector && (
        <GetWalletIcon
          connector={connector}
          account={account}
          showPortisButton={true}
        />
      ),
    }
  } else if (error) {
    buttonProps = {
      ...buttonProps,
      className: ButtonStyles.Error,
      text: error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error',
      icon: <NetworkIcon />,
    }
  }

  return (
    <LoginButton {...buttonProps} />
  )
}

export default function ConnectAccount({ autoLogin, updateLoginAccount, darkMode, transactions }) {
  return (
    <ConnectAccountButton autoLogin={autoLogin} updateLoginAccount={updateLoginAccount} darkMode={darkMode} transactions={transactions} />
  );
}

