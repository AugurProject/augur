import React from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import Copy from './Copy'
import Identicon from '../Identicon'
import { getEtherscanLink } from '../../utils'
import { shortenAddress } from '../../utils'
import { injected, walletconnect, walletlink, fortmatic, portis } from '../../connectors'
import { ReactComponent as Close } from '../../assets/x.svg'
import CoinbaseWalletIcon from '../../assets/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/walletConnectIcon.svg'
import FortmaticIcon from '../../assets/fortmaticIcon.png'
import PortisIcon from '../../assets/portisIcon.png'
import { SUPPORTED_WALLETS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'

import Styles from 'modules/ConnectAccount/components/AccountDetails/index.less';

const HeaderRow = ({ darkMode, children }) => (
  <div
    style={{
      padding: '1rem 1rem',
      fontWeight: 500,
      color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`,
    }
  }>
    {children}
  </div>
)

const UpperSection = ({ children }) => (
  <div
    style={{
      position: 'relative',
    }
  }>
    {children}
  </div>
)

const InfoCard = ({ darkMode, children }) => (
  <div
    style={{
      padding: '1rem',
      border: `1px solid ${darkMode ? '#40444F' : '#EDEEF2'}`,
      borderRadius: '20px',
      position: 'relative',
      display: 'grid',
      gridRowGap: '12px',
      marginBottom: '20px',
    }
  }>
    {children}
  </div>
)

const AccountGroupingRow = ({ darkMode, children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 400,
      color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`
    }
  }>
    {children}
  </div>
)

const AccountSection = ({ darkMode, children }) => (
  <div
    style={{
      backgroundColor: `${darkMode ? '#212429' : '#FAFAFA'}`,
      padding: `0rem 1rem`,
    }
  }>
    {children}
  </div>
)

const AccountControl = ({ children }) => (
  <div
    className={Styles.AccountControl}
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      minWidth: 0,
      width: '100%',
      fontWeight: 500,
      fontSize: '1.25rem'
    }
  }>
    {children}
  </div>
)

const StyledLink = ({ darkMode, children, ...rest }) => (
  <a className={darkMode ? Styles.darkLink : Styles.lightLink} {...rest}>{children}</a>
)

const ExternalLink = ({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  darkMode,
  ...rest
}) => {
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

const WalletName = ({ darkMode, children }) => (
  <div style={{
    width: 'initial',
    fontSize: '0.825rem',
    fontWeight: 500,
    color: `${darkMode ? '#6C7284' : '#888D9B'}`
  }}>
    {children}
  </div>
)


const IconWrapper = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  }}>
    {children}
  </div>
)

const WalletAction = ({ onClick, darkMode, children }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'center',
      cursor: 'pointer',
      margin: '6px 0 0 0',
      fontWeight: 600,
      fontSize: '12px',
      color: `${darkMode ? '#2172E5' : '#15171A'}`,
      padding: '4px 8px',
      background: '#EDEFF1',
      border: '1px solid #8B959E',
      borderRadius: '8px',
  }}>
    {children}
  </div>
)


interface AccountDetailsProps {
  toggleWalletModal: () => void
  openOptions: () => void
  darkMode: boolean
}

export default function AccountDetails({
  toggleWalletModal,
  openOptions,
  darkMode,
}: AccountDetailsProps) {
  const { chainId, account, connector } = useActiveWeb3React()

  function formatConnectorName() {
    const ethereum = window['ethereum']
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <WalletName darkMode={darkMode}>Connected with {name}</WalletName>
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper>
          <Identicon account={account} />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper>
          <img height={'16px'} src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper>
          <img height={'16px'} src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper>
          <img height={'16px'} src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper>
            <img height={'16px'} src={PortisIcon} alt={'portis logo'} />
            <WalletAction
              darkMode={darkMode}
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </WalletAction>
          </IconWrapper>
        </>
      )
    }
    return null
  }

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor darkMode={darkMode} />
        </CloseIcon>
        <HeaderRow darkMode={darkMode}>Account</HeaderRow>
        <AccountSection darkMode={darkMode}>
          <div>
            <InfoCard darkMode={darkMode}>
              <AccountGroupingRow darkMode={darkMode}>
                {formatConnectorName()}
                <div>
                  {connector !== injected && connector !== walletlink && (
                    <WalletAction
                      darkMode={darkMode}
                      onClick={() => {
                        ;(connector as any).close()
                      }}
                    >
                      Disconnect
                    </WalletAction>
                  )}
                  <WalletAction
                    darkMode={darkMode}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Switch Wallet
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow darkMode={darkMode}>
                <AccountControl>
                  <>
                    {getStatusIcon()}
                    <p> {account && shortenAddress(account)}</p>
                  </>
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow darkMode={darkMode}>
                  <>
                    <AccountControl>
                      <>
                        {account && (
                          <Copy darkMode={darkMode} toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>Copy Address</span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <ExternalLink
                            href={getEtherscanLink(chainId, account, 'address')}
                            darkMode={darkMode}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>View on Etherscan</span>
                          </ExternalLink>
                        )}
                      </>
                    </AccountControl>
                  </>
              </AccountGroupingRow>
            </InfoCard>
          </div>
        </AccountSection>
      </UpperSection>
    </>
  )
}
