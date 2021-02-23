import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@uniswap/sdk'

const PORTIS_ID = 'ede221f9-710f-44c9-a429-ed28bbb54376'
const FORTMATIC_API_KEY = 'pk_live_8001A50CCA35D8CB'
const FORTMATIC_API_TEST_KEY = 'pk_test_5185BE42CA372148'
let FORMATIC_KEY = FORTMATIC_API_TEST_KEY

export const NETWORK_CHAIN_ID: number = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : ChainId.KOVAN

if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
  FORMATIC_KEY = FORTMATIC_API_KEY
}

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || NETWORK_CHAIN_ID === ChainId.MAINNET
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
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
