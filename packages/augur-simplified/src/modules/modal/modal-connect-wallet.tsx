import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Header} from './common';
import Styles from 'modules/modal/modal.styles.less';
import {SecondaryButton, TextButton, WalletButton} from 'modules/common/buttons';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {SUPPORTED_WALLETS} from 'modules/ConnectAccount/constants';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {injected, portis} from 'modules/ConnectAccount/connectors';
import {isMobile} from 'react-device-detect';
import MetamaskIcon from 'modules/ConnectAccount/assets/metamask.png';
import {ErrorBlock} from 'modules/common/labels';
import Loader from 'modules/ConnectAccount/components/Loader';
import AccountDetails from 'modules/ConnectAccount/components/AccountDetails';
import {useAppStatusStore} from 'modules/stores/app-status';
import classNames from 'classnames';
import {MODAL_CONNECT_WALLET} from 'modules/constants';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

const WalletList = ({walletList}) => (
  <ul>
    {
      walletList.map(wallet => (
        <li key={wallet.key}>
          <WalletButton {...wallet} />
        </li>
      ))
    }
  </ul>
);

interface PendingWalletViewProps {
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
      {
        error ? (
          <div>
            <span>Error connecting.</span>
            <SecondaryButton
              action={() => {
                setPendingError(false)
                connector && tryActivation(connector)
              }}
              text='Try again'
            />
          </div>
        ) : (
          <>
            <Loader darkMode={darkMode} />
            <span>Initializing...</span>
          </>
        )
      }
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const wallet = SUPPORTED_WALLETS[key];

        if (wallet.connector === connector) {
          if (wallet.connector === injected) {
            if (isMetamask && wallet.name !== 'MetaMask') {
              return null;
            }
            if (!isMetamask && wallet.name === 'MetaMask') {
              return null;
            }
          }
          return (
            <WalletButton
              id={`connect-${key}`}
              key={key}
              text={wallet.name}
              // subheader={wallet.description}
              icon={(
                <img
                  src={require('modules/ConnectAccount/assets/' + wallet.iconName).default}
                  alt={wallet.name}
                />
              )}
            />
          )
        }
        return null;
      })}
    </div>
  )
}

interface ModalConnectWalletProps {
  darkMode: boolean;
  autoLogin: boolean;
  transactions: any;
}

const ModalConnectWallet = ({
  darkMode,
  autoLogin,
  transactions,
}: ModalConnectWalletProps) => {
  const {
    actions: { closeModal, setModal },
    modal: { type },
  } = useAppStatusStore();
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();
  const [pendingError, setPendingError] = useState<boolean>();
  const previousAccount = usePrevious(account);
  const [walletList, setWalletList] = useState();
  const modalIsOpen = type === MODAL_CONNECT_WALLET;

  const toggleModal = useCallback(() => {
    if (type === MODAL_CONNECT_WALLET) {
      closeModal();
    } else {
      setModal({
        type,
        darkMode,
        autoLogin,
        transactions,
      });
    }
  }, [autoLogin, closeModal, darkMode, modalIsOpen, setModal, transactions, type]);

  const tryActivation = useCallback((connector: AbstractConnector | undefined) => {
    let name = '';
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        name = SUPPORTED_WALLETS[key].name;
        return (name);
      }
      return true;
    })
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    setTimeout(() => {
      connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      }).then(() => {
        activate(connector)
        setWalletView(WALLET_VIEWS.ACCOUNT)
      })
    });

  }, [activate]);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount) {
      // closeModal();
      // toggleModal();
    }

    if (autoLogin && !account) {
      const option = SUPPORTED_WALLETS['METAMASK']
      tryActivation(option.connector)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [autoLogin, tryActivation, account, previousAccount, toggleModal]);

  // always reset to account view
  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    setPendingError(false);
    setWalletView(WALLET_VIEWS.ACCOUNT);
    // fortmatic.on(OVERLAY_READY, () => {
    //   // closeModal();
    //   toggleModal();
    // });
  }, [toggleModal]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, activePrevious, connectorPrevious]);

  const getWalletButtons = useCallback(() => {
    const isMetamask = window['ethereum'] && window['ethereum']['isMetaMask']
    const walletButtons = Object.keys(SUPPORTED_WALLETS).map(key => {
      const wallet = SUPPORTED_WALLETS[key];
      if (isMobile) {
        if (!window['web3'] && !window['ethereum'] && wallet.mobile && wallet.connector !== portis) {
          return {
            action: () => wallet.connector !== connector && !wallet.href && tryActivation(wallet.connector),
            id: `connect-${key}`,
            key,
            selected: wallet?.connector === connector,
            href: wallet.href,
            text: wallet.name,
            icon: (
              <img
                src={require('modules/ConnectAccount/assets/' + wallet.iconName).default}
                alt={wallet.name}
              />
            ),
          };
        }
      } else {
        if (wallet.connector === injected) {
          if (!(window['web3'] || window['ethereum'])) {
            if (wallet.name === 'MetaMask') {
              return {
                id: `connect-${key}`,
                key,
                text: 'Install Metamask',
                href: 'https://metamask.io/',
                icon: MetamaskIcon,
                selected: wallet?.connector === connector,
              }
            } else {
              return null;
            }
          } else if ((wallet.name === 'MetaMask' && !isMetamask) || (wallet.name === 'Injected' && isMetamask)) {
            return null;
          }
        }
        if (!wallet.mobileOnly) {
          return {
            id: `connect-${key}`,
            action: () =>
              wallet.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !wallet.href && tryActivation(wallet.connector),
            key,
            selected: wallet?.connector === connector,
            href: wallet.href,
            text: wallet.name,
            icon: (
              <img
                src={require('modules/ConnectAccount/assets/' + wallet.iconName).default}
                alt={wallet.name}
              />
            ),
          }
        }
      }
      return null;
    }).filter(element => !!element);
    return walletButtons;
  }, [connector, tryActivation]);

  useEffect(() => {
    setWalletList(getWalletButtons());
  }, [getWalletButtons]);

  return (
    <div className={classNames(Styles.ModalConnectWallet, {
      [Styles.Account]: account && walletView === WALLET_VIEWS.ACCOUNT,
    })}>
      <Header
        title={walletView !== WALLET_VIEWS.ACCOUNT ? (
          <span
            className={Styles.HeaderLink}
            onClick={() => {
              setPendingError(false)
              setWalletView(WALLET_VIEWS.ACCOUNT)
            }}
          >
            Back
          </span>
        ) : (account && walletView === WALLET_VIEWS.ACCOUNT) ?
          'Account' :
          'Connect a wallet'
        }
      />
      <div>
        {
          error ? (
            <ErrorBlock
              text={
                error instanceof UnsupportedChainIdError ?
                  'Please connect to the appropriate Ethereum network.' :
                  'Error connecting. Try refreshing the page.'
              }
            />
          ) : (account && walletView === WALLET_VIEWS.ACCOUNT) ? (
            <AccountDetails
              toggleWalletModal={() => toggleModal()}
              openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
              darkMode={darkMode}
              transactions={transactions}
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
                New to Ethereum? <TextButton href='https://ethereum.org/wallets/' text='Learn more about wallets' />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default ModalConnectWallet;
