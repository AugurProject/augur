import React, { useState } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { lighten } from 'polished'
import { Activity } from 'react-feather'
import { ethers } from 'ethers'
import WalletModal from './components/WalletModal'
import Identicon from './components/Identicon'
import CoinbaseWalletIcon from './assets/coinbaseWalletIcon.svg'
import FortmaticIcon from './assets/fortmaticIcon.png'
import PortisIcon from './assets/portisIcon.png'
import WalletConnectIcon from './assets/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from './connectors'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useActiveWeb3React } from './hooks'

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}


const IconWrapper = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </div>
)

const Web3StatusConnect = ({ children, darkMode, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      fontWeight: 500,
      textAlign: 'center',
      borderRadius: '12px',
      outline: 'none',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 1,
      padding: '0.5rem',
      backgroundColor: `${darkMode ? '#2C2F36' : '#FFFFFF'}`,
      border: `1px solid ${lighten(0.75, darkMode ? '#000000' : '#000000')}`,
      color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`,
    }}
  >
      {children}
  </button>
)

const Web3StatusConnected = ({ children, darkMode, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      fontWeight: 500,
      textAlign: 'center',
      borderRadius: '12px',
      outline: 'none',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 1,
      padding: '0.5rem',
      backgroundColor: `${darkMode ? '#2C2F36' : '#F7F8FA'}`,
      border: `1px solid ${lighten(0.75, darkMode ? '#000000' : '#000000')}`,
      color: `${darkMode ? '#FAFAFA' : '#1F1F1F'}`,
    }}
  >
      {children}
  </button>
)

const Web3StatusError = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      fontWeight: 500,
      textAlign: 'center',
      borderRadius: '12px',
      outline: 'none',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 1,
      padding: '0.5rem',
      backgroundColor: '#FF6871',
      border: '1px solid #FF6871',
      color: '#FFFFFF',
    }}
  >
      {children}
  </button>
)

const Text = ({ children }) => (
  <p style={{
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: '0 0.5rem 0 0.25rem',
    fontSize: '1rem',
    width: 'fit-content',
    fontWeight: 800,
  }}>
    {children}
  </p>
)


const NetworkIcon = () => (
  <Activity style={{
    marginLeft: '0.25rem',
    marginRight: '0.5rem',
    width: '16px',
    height: '16px',
  }} />
)

function shortenAddress(address: string, chars = 4): string {
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

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector, darkMode, account }: { connector: AbstractConnector, darkMode: boolean, account: string }) {
  if (connector === injected) {
    return <Identicon account={account} />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper>
        <img height={'16px'} src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper>
        <img height={'16px'} src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper>
        <img height={'16px'} src={FortmaticIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper>
        <img height={'16px'} src={PortisIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function App({ autoLogin, updateLoginAccount, darkMode }) {
  const { account, connector, error } = useWeb3React()
  const [showModal, setShowModal] = useState<boolean>()

  const activeWeb3 = useActiveWeb3React()
  let innerStatusContent = null

  if (account) {
    updateLoginAccount(activeWeb3);
    innerStatusContent = (
      <Web3StatusConnected onClick={() => setShowModal(!showModal)} darkMode={darkMode}>
        <>
          <Text>{shortenAddress(account)}</Text>
        </>
        {connector && <StatusIcon account={account} darkMode={darkMode} connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    innerStatusContent = (
      <Web3StatusError onClick={() => setShowModal(!showModal)}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    innerStatusContent = (
      <Web3StatusConnect onClick={() => setShowModal(!showModal)} darkMode={darkMode}>
        <Text>Connect Account</Text>
      </Web3StatusConnect>
    )
  }

  return (
    <>
      {innerStatusContent}
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
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <App autoLogin={autoLogin} updateLoginAccount={updateLoginAccount} darkMode={darkMode} />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

