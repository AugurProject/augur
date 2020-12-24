import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { ChainId } from '@uniswap/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import copy from 'copy-to-clipboard'
import { useState, useCallback, useEffect } from 'react'
import { AugurLite, NetworkId } from "@augurproject/sdk-lite";
import BigNumber from 'bignumber.js'
import { useAppStatusStore } from '../../stores/app-status'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>('NETWORK')
  return context.active ? context : contextNetwork
}

export function useCopyClipboard(timeout = 500): [boolean, (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback(text => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy]
}

// TODO: this prob needs to go into context
let augurClient = null;
export function useAugurClient() {
  const activeWeb3 = useActiveWeb3React()
  const { account, library, chainId } = useActiveWeb3React()
  const {
    paraConfig,
  } = useAppStatusStore();

  useEffect(() => {
    async function createAugurClient() {
      if (!library || !chainId || !account) return
      console.info('building/getting augur client', paraConfig.addresses)
      const networkId = String(chainId) as NetworkId;
      augurClient = new AugurLite(library, paraConfig, networkId, new BigNumber(18));
    }
    if (!augurClient) {
      createAugurClient()
    }
  }, [augurClient, library, chainId, paraConfig, account])

  return augurClient
}
