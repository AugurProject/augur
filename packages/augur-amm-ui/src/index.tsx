import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import ThemeProvider, { GlobalStyle } from './Theme'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import AccountContextProvider from './contexts/Account'
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/TokenData'
import GlobalDataContextProvider from './contexts/GlobalData'
import PairDataContextProvider, { Updater as PairDataContextUpdater } from './contexts/PairData'
import ApplicationContextProvider from './contexts/Application'
import UserContextProvider from './contexts/User'
import MarketsProvider, { Updater as MarketsProviderContextUpdater } from './contexts/Markets'
import App from './App'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from './constants'
import getLibrary from './utils/getLibrary'
import { Provider } from 'react-redux'
import store from './state'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ApplicationUpdater from './state/application/updater'
import UserUpdater from './state/user/updater'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// initialize GA
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <AccountContextProvider>
          <TokenDataContextProvider>
            <GlobalDataContextProvider>
              <PairDataContextProvider>
                <MarketsProvider>
                  <UserContextProvider>{children}</UserContextProvider>
                </MarketsProvider>
              </PairDataContextProvider>
            </GlobalDataContextProvider>
          </TokenDataContextProvider>
        </AccountContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <PairDataContextUpdater />
      <TokenDataContextUpdater />
      <MarketsProviderContextUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <ApplicationUpdater />
      <UserUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Provider store={store}>
        <ContextProviders>
          <Updaters />
          <ThemeProvider>
            <>
              <GlobalStyle />
              <App />
            </>
          </ThemeProvider>
        </ContextProviders>
      </Provider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
