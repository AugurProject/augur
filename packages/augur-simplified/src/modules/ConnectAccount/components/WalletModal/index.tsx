import { useCallback } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'

import MetamaskIcon from '../../assets/metamask.png'
import { ReactComponent as Close } from '../../assets/x.svg'

import { fortmatic, injected, portis } from '../../connectors'
import { OVERLAY_READY } from '../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../constants'
import AccountDetails from '../AccountDetails'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'

import Styles from 'modules/ConnectAccount/components/WalletModal/index.less';

const StyledLink = ({ darkMode, children, ...rest }) => (
  <a className={darkMode ? Styles.darkLink : Styles.lightLink} {...rest}>{children}</a>
)

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  darkMode,
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
  return <StyledLink darkMode={darkMode} target={target} rel={rel} href={href} {...rest} />
}

const CloseIcon = ({ onClick, children }) => (
  <div className={Styles.hoverClose} onClick={onClick}
    style={{
      position: 'absolute',
      right: '1rem',
      top: '14px'
    }
  }>
    {children}
  </div>
)

const CloseColor = ({ darkMode }) => (
  <div className={darkMode ? Styles.SVGDark : Styles.SVGLight}>
    <Close />
  </div>
)

const Wrapper = ({ children }) => (
  <div style={{
    margin: '0',
    padding: '0',
    width: '100%'
  }}>
    {children}
  </div>
)

const HeaderRow = ({ darkMode, children }) => (
  <div style={{
    padding: '1rem 1rem',
    fontWeight: 500,
    color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`,
  }}>
    {children}
  </div>
)

const ContentWrapper = ({ darkMode, children }) => (
  <div style={{
    backgroundColor: `${darkMode ? '#2C2F36' : '#F7F8FA'}`,
    padding: '2rem',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px'
  }}>
    {children}
  </div>
)

const UpperSection = ({ children }) => (
  <div style={{
    position: 'relative',
  }}>
    {children}
  </div>
)

const Blurb = ({ darkMode, children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '2rem',
    color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`,
  }}>
    {children}
  </div>
)

const OptionGrid = ({ children }) => (
  <div style={{
    display: 'grid',
    gridGap: '10px'
  }}>
    {children}
  </div>
)

const HoverText = ({ onClick, children }) => (
  <div onClick={onClick ? onClick : null} className={Styles.hoverText}>
    {children}
  </div>
)

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


export default function WalletModal({
  showModal,
  toggleWalletModal,
  darkMode,
  autoLogin,
  transactions,
}: {
  showModal: boolean
  toggleWalletModal: Function
  darkMode: boolean
  autoLogin: boolean
  transactions
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = showModal

  const previousAccount = usePrevious(account)


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

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window['ethereum'] && window['ethereum']['isMetaMask']
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window['web3'] && !window['ethereum'] && option.mobile) {
          return (
            <Option
              darkMode={darkMode}
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require('../../assets/' + option.iconName).default}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window['web3'] || window['ethereum'])) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                darkMode={darkMode}
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            darkMode={darkMode}
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/' + option.iconName).default}
          />
        )
      )
    })
  }

  function getModalContent(darkMode) {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={() => toggleWalletModal()}>
            <CloseColor darkMode={darkMode} />
          </CloseIcon>
          <HeaderRow darkMode={darkMode}>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</HeaderRow>
          <ContentWrapper darkMode={darkMode} >
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please connect to the appropriate Ethereum network.</h5>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={() => toggleWalletModal()}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
          darkMode={darkMode}
          transactions={transactions}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={() => toggleWalletModal()}>
          <CloseColor darkMode={darkMode}  />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow darkMode={darkMode}>
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow darkMode={darkMode}>
            <HoverText>Connect to a wallet</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper darkMode={darkMode} >
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              darkMode={darkMode}
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb darkMode={darkMode}>
              <span>New to Ethereum? &nbsp;</span>{' '}
              <ExternalLink darkMode={darkMode} href="https://ethereum.org/wallets/">Learn more about wallets</ExternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal darkMode={darkMode} isOpen={walletModalOpen} onDismiss={() => toggleWalletModal()} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent(darkMode)}</Wrapper>
    </Modal>
  )
}
