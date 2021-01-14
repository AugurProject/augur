import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Header} from './common';
import Styles from 'modules/modal/modal.styles.less';
import {TextButton, WalletButton} from 'modules/common/buttons';
import {GetWalletIcon} from 'modules/common/get-wallet-icon';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {SUPPORTED_WALLETS} from 'modules/ConnectAccount/constants';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {fortmatic, injected, portis} from 'modules/ConnectAccount/connectors';
import {OVERLAY_READY} from 'modules/ConnectAccount/connectors/Fortmatic';
import {isMobile} from 'react-device-detect';
import MetamaskIcon from 'modules/ConnectAccount/assets/metamask.png';
import PendingView from 'modules/ConnectAccount/components/WalletModal/PendingView';
import {ErrorBlock} from 'modules/common/labels';

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
)

interface ModalConnectWalletProps {
  showModal: boolean;
  toggleWalletModal: Function;
  darkMode: boolean;
  autoLogin: boolean;
}

const ModalConnectWallet = ({
  showModal,
  toggleWalletModal,
  autoLogin,
}: ModalConnectWalletProps) => {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [pendingError, setPendingError] = useState<boolean>()
  const walletModalOpen = showModal
  const previousAccount = usePrevious(account)
  const [walletList, setWalletList] = useState();

  const tryActivation = useCallback((connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        name = SUPPORTED_WALLETS[key].name
        return (name)
      }
      return true
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

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

  }, [activate])

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }

    if (autoLogin && !account) {
      const option = SUPPORTED_WALLETS['METAMASK']
      tryActivation(option.connector)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [autoLogin, tryActivation, account, previousAccount, walletModalOpen, toggleWalletModal])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [showModal, toggleWalletModal])

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
            // icon: require('../../assets/' + wallet.iconName).default,
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
            // icon: require('../../assets/' + wallet.iconName).default,
          }
        }
      }
    }).filter(element => !!element);
    return walletButtons;
  }, [connector, tryActivation]);

  useEffect(() => {
    setWalletList(getWalletButtons());
  }, [getWalletButtons]);

  return (
    <div className={Styles.ModalConnectWallet}>
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
        ) : 'Connect a wallet'}
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
          ) : (
            walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <>
              {walletList && <WalletList walletList={walletList} />}
              <div>
                New to Ethereum? <TextButton href='https://ethereum.org/wallets/' text='Learn more about wallets' />
              </div>
            </>
          ))
        }
      </div>
    </div>
  );
};

export default ModalConnectWallet;
