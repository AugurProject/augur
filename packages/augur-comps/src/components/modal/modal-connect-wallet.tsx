import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './common';
import Styles from './modal.styles.less';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import MetamaskIcon from '../ConnectAccount/assets/metamask.png';
import classNames from 'classnames';
import { NETWORK_NAMES } from '../../stores/constants';
import { SecondaryButton, TextButton, WalletButton } from '../common/buttons';
import { ErrorBlock } from '../common/labels';
import { isSafari } from '../ConnectAccount/utils';
import { SUPPORTED_WALLETS } from '../ConnectAccount/constants';
import {
  NETWORK_CHAIN_ID,
  portis,
  injected,
} from '../ConnectAccount/connectors';
import { Loader } from '../ConnectAccount/components/Loader';
import { AccountDetails } from '../ConnectAccount/components/AccountDetails';
import { useActiveWeb3React } from '../ConnectAccount/hooks';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const WalletList = ({ walletList }) => (
  <ul>
    {walletList.map((wallet) => (
      <li key={wallet.key}>
        <WalletButton {...wallet} />
      </li>
    ))}
  </ul>
);

export interface PendingWalletViewProps {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
  darkMode?: boolean;
}

const PendingWalletView = ({
  connector,
  error = false,
  setPendingError,
  tryActivation,
  darkMode,
}: PendingWalletViewProps) => {
  const isMetamask = window['ethereum'] && window['ethereum']['isMetaMask'];

  return (
    <div className={Styles.PendingWalletView}>
      {error ? (
        <div>
          <span>Error connecting.</span>
          <SecondaryButton
            action={() => {
              setPendingError(false);
              connector && tryActivation(connector);
            }}
            text="Try again"
          />
        </div>
      ) : (
        <>
          <Loader darkMode={darkMode} />
          <span>Initializing...</span>
        </>
      )}
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const wallet = SUPPORTED_WALLETS[key];

        if (wallet.connector === connector) {
          if (
            wallet.connector === injected &&
            ((isMetamask && wallet.name !== 'MetaMask') ||
              (!isMetamask && wallet.name === 'MetaMask'))
          ) {
            return null;
          }

          return (
            <WalletButton
              id={`connect-${key}`}
              key={key}
              text={wallet.name}
              icon={
                <img
                  src={
                    require('../ConnectAccount/assets/' + wallet.iconName)
                      .default
                  }
                  alt={wallet.name}
                />
              }
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export interface ModalConnectWalletProps {
  darkMode: boolean;
  autoLogin: boolean;
  transactions: any;
  isLogged: boolean;
  isMobile: boolean;
  closeModal: Function;
  removeTransaction: Function;
  logout: Function;
  updateTxFailed?: Function;
  updateMigrated?: Function;
}

const ModalConnectWallet = ({
  darkMode,
  autoLogin,
  transactions,
  isLogged,
  isMobile,
  closeModal,
  removeTransaction,
  logout,
  updateTxFailed,
  updateMigrated,
}: ModalConnectWalletProps) => {
  const { active, account, connector, activate, error } = useWeb3React();
  const { deactivate } = useActiveWeb3React();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [pendingError, setPendingError] = useState<boolean>();
  const previousAccount = usePrevious(account);
  const [walletList, setWalletList] = useState(null);

  const tryActivation = useCallback(
    (connector: AbstractConnector | undefined) => {
      setPendingWallet(connector); // set wallet for pending view
      setWalletView(WALLET_VIEWS.PENDING);

      // if the connector is WalletConnect and the user has already tried to connect, manually reset the connector
      if (
        connector instanceof WalletConnectConnector &&
        connector.walletConnectProvider?.wc?.uri
      ) {
        connector.walletConnectProvider = undefined;
      }

      setTimeout(() => {
        connector &&
          activate(connector, undefined, true)
            .catch((error) => {
              if (error instanceof UnsupportedChainIdError) {
                activate(connector); // a little janky...can't use setError because the connector isn't set
              } else {
                setPendingError(true);
              }
            })
            .then(() => {
              activate(connector);
              closeModal();
            });
      });
    },
    [activate]
  );

  // close on connection, when logged out before
  useEffect(() => {
    if (autoLogin && !account) {
      const option = SUPPORTED_WALLETS['METAMASK'];
      tryActivation(option.connector);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [autoLogin, tryActivation, account, previousAccount]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (
      (active && !activePrevious) ||
      (connector && connector !== connectorPrevious && !error)
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    activePrevious,
    connectorPrevious,
  ]);

  const getWalletButtons = useCallback(() => {
    const isMetamask = window['ethereum'] && window['ethereum']['isMetaMask'];
    const isWeb3 = window['web3'] || window['ethereum'];
    const walletButtons = Object.keys(SUPPORTED_WALLETS)
      .filter((wallet) => !(wallet === 'PORTIS' && isSafari()))
      .map((key) => {
        const wallet = SUPPORTED_WALLETS[key];
        const commonWalletButtonProps = {
          action: () =>
            wallet.connector !== connector &&
            !wallet.href &&
            tryActivation(wallet.connector),
          href: wallet.href,
          icon: (
            <img
              src={
                require('../ConnectAccount/assets/' + wallet.iconName).default
              }
              alt={wallet.name}
            />
          ),
          id: `connect-${key}`,
          key,
          selected: isLogged && wallet?.connector === connector,
          text: wallet.name,
        };

        if (isMobile) {
          if (
            !window['web3'] &&
            !window['ethereum'] &&
            wallet.mobile &&
            wallet.name !== SUPPORTED_WALLETS['METAMASK'].name &&
            wallet.name !== SUPPORTED_WALLETS['INJECTED'].name &&
            wallet.connector !== portis
          ) {
            return commonWalletButtonProps;
          } else {
            if (wallet.name === 'MetaMask' && !isMetamask) {
              return null;
            }

            if (wallet.name === SUPPORTED_WALLETS['INJECTED'].name && !isWeb3) {
              return null;
            }

            if (wallet.mobile && wallet.connector !== portis) {
              return commonWalletButtonProps;
            }
          }
        } else {
          if (wallet.connector === injected) {
            if (!(window['web3'] || window['ethereum'])) {
              if (wallet.name === SUPPORTED_WALLETS['METAMASK'].name) {
                return {
                  ...commonWalletButtonProps,
                  text: 'Install Metamask',
                  href: 'https://metamask.io/',
                  icon: <img src={MetamaskIcon} alt={wallet.name} />,
                };
              } else {
                return null;
              }
            } else if (
              (wallet.name === SUPPORTED_WALLETS['METAMASK'].name &&
                !isMetamask) ||
              (wallet.name === SUPPORTED_WALLETS['INJECTED'].name &&
                !isMetamask)
            ) {
              return null;
            }
          }
          if (!wallet.mobileOnly) {
            return commonWalletButtonProps;
          }
        }
        return null;
      })
      .filter((element) => !!element);
    return walletButtons;
  }, [connector, tryActivation]);

  useEffect(() => {
    setWalletList(getWalletButtons());
  }, [getWalletButtons]);

  return (
    <section>
      <Header
        closeModal={closeModal}
        title={
          walletView !== WALLET_VIEWS.ACCOUNT ? (
            <span
              className={Styles.HeaderLink}
              onClick={() => {
                setPendingError(false);
                setWalletView(WALLET_VIEWS.ACCOUNT);
              }}
            >
              Back
            </span>
          ) : account && walletView === WALLET_VIEWS.ACCOUNT ? (
            'Account'
          ) : (
            'Connect a wallet'
          )
        }
      />
      <main>
        <div
          className={classNames(Styles.ModalConnectWallet, {
            [Styles.Account]: account && walletView === WALLET_VIEWS.ACCOUNT,
          })}
        >
          {error ? (
            <ErrorBlock
              text={
                error instanceof UnsupportedChainIdError
                  ? `Please connect your wallet to the ${NETWORK_NAMES[NETWORK_CHAIN_ID]} Ethereum network and refresh the page.`
                  : 'Error connecting. Try refreshing the page.'
              }
            />
          ) : account && walletView === WALLET_VIEWS.ACCOUNT ? (
            <AccountDetails
              openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
              darkMode={darkMode}
              transactions={transactions}
              removeTransaction={removeTransaction}
              logout={() => {
                deactivate();
                closeModal();
                logout();
                updateTxFailed && updateTxFailed(false);
                updateMigrated && updateMigrated(false);
              }}
            />
          ) : walletView === WALLET_VIEWS.PENDING ? (
            <PendingWalletView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <>
              {walletList && <WalletList walletList={walletList} />}
              <div className={Styles.LearnMore}>
                New to Ethereum?{' '}
                <TextButton
                  href="https://ethereum.org/wallets/"
                  text="Learn more about wallets"
                />
              </div>
            </>
          )}
        </div>
      </main>
    </section>
  );
};

export default ModalConnectWallet;
