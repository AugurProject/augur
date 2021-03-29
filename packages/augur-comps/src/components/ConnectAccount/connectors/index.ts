import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@uniswap/sdk'
import { PARA_CONFIG } from '../../../stores/constants';

const networkId = PARA_CONFIG.networkId;
const PORTIS_ID = 'ede221f9-710f-44c9-a429-ed28bbb54376'
const FORTMATIC_API_KEY = 'pk_live_8001A50CCA35D8CB'
const FORTMATIC_API_TEST_KEY = 'pk_test_5185BE42CA372148'
let FORMATIC_KEY = FORTMATIC_API_TEST_KEY

export const NETWORK_CHAIN_ID: number = networkId ? parseInt(networkId) : ChainId.KOVAN

if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
  FORMATIC_KEY = FORTMATIC_API_KEY
}

const NETWORK_URL = NETWORK_CHAIN_ID === ChainId.MAINNET
  ? 'https://eth-mainnet.alchemyapi.io/v2/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM'
  : 'https://eth-kovan.alchemyapi.io/v2/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM'

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { [NETWORK_CHAIN_ID]: NETWORK_URL },

  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: NETWORK_CHAIN_ID
})

export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [NETWORK_CHAIN_ID]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Augur',
  appLogoUrl:
    'data:image/png;base64,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'
})
