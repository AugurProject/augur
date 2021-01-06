import React, {ReactElement, useState} from 'react';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {Activity as NetworkIcon} from 'react-feather';
import {ethers} from 'ethers';
import WalletModal from './components/WalletModal';
import {SecondaryButton} from '../common/buttons';
import classNames from 'classnames';
import ButtonStyles from 'modules/common/buttons.styles.less';
import {GetWalletIcon} from 'modules/common/get-wallet-icon';

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

const ConnectAccountButton = ({ autoLogin, darkMode }) => {
  const { account, connector, error } = useWeb3React();
  const [showModal, setShowModal] = useState<boolean>();

  let buttonProps = {
    action: () => setShowModal(!showModal),
    className: null,
    darkMode,
    icon: null,
    text: 'Connect Account',
  };

  useEffect(() => {
    if (account) {
      updateLoginAccount(activeWeb3);
    }
  }, [account, activeWeb3, updateLoginAccount])

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
    <>
      <LoginButton {...buttonProps} />
      <WalletModal
        toggleWalletModal={() => setShowModal(!showModal)}
        showModal={showModal}
        darkMode={darkMode}
        autoLogin={autoLogin}
      />
    </>
  )
}

export default function ConnectAccount({ autoLogin, updateLoginAccount, darkMode }) {
  return (
    <ConnectAccountButton autoLogin={autoLogin} updateLoginAccount={updateLoginAccount} darkMode={darkMode} />
  );
}

