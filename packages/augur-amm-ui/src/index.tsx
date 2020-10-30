import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import ThemeProvider, { ThemedGlobalStyle } from './Theme'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import AccountContextProvider from './contexts/Account'
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/TokenData'
import GlobalDataContextProvider from './contexts/GlobalData'
import ApplicationContextProvider from './contexts/Application'
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
import { BrowserRouter } from 'react-router-dom'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <AccountContextProvider>
          <TokenDataContextProvider>
            <GlobalDataContextProvider>
              <MarketsProvider>
                {children}
              </MarketsProvider>
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
            <BrowserRouter>
              <ThemedGlobalStyle />
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </ContextProviders>
      </Provider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
