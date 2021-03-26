import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ChainId } from "@uniswap/sdk"
import { Contract, ethers } from "ethers"
import { AddressZero } from '@ethersproject/constants'
import { EthersProvider } from '@augurproject/sdk';
import {SUPPORTED_WALLETS} from '../constants';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {UnsupportedChainIdError} from '@web3-react/core';

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.'
}

export const isAddress = value => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'market' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'market': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner | EthersProvider {
  if (account) {
    // This just connects the account if necessary.
    return getSigner(library, account)
  }

  return new EthersProvider(library, 5, 50, 10)
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}

export const tryAutoLogin = (activate) => {
  const {connector} = SUPPORTED_WALLETS['METAMASK'];
  // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
  if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
    connector.walletConnectProvider = undefined
  }

  setTimeout(() => {
    activate(connector, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(connector) // a little janky...can't use setError because the connector isn't set
      }
    }).then(() => {
      activate(connector)
    })
  });
}

export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
