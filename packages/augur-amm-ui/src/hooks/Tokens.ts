import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals } from '@uniswap/sdk'
import { useMemo } from 'react'
import { MarketTokens } from '../constants'
import { doUseETH } from '../contexts/Application'
import { MarketCurrency } from '../model/MarketCurrency'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useSwapQueryParam } from '../state/swap/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { useMarketShareBalances } from '../state/wallet/hooks'
import { isAddress } from '../utils'

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'

export function useAllMarketTokens(marketId: string, cash: string, amm: string): Currency[] {
  const [userMarketShareBalances] = useMarketShareBalances()
  const { chainId } = useActiveWeb3React()
  const cashToken = useCurrency(cash)

  return useMemo(() => {
    const marketInfo = userMarketShareBalances.find(b => b.marketId === marketId && b.cash.address === cash)

    const tokens = []
    if (cashToken) tokens.push(cashToken)
    const address = marketId
    const defaultDecimals = 18;

    const noToken = new Token(chainId, address, cashToken?.decimals || defaultDecimals, MarketTokens.NO_SHARES, MarketTokens.NO_SHARES)
    const noMarketCurrency = new MarketCurrency(marketId, cash, amm, noToken, String(marketInfo?.noAmount || 0))
    if (noMarketCurrency) tokens.push(noMarketCurrency)

    const yesToken = new Token(chainId, address, cashToken?.decimals || defaultDecimals, MarketTokens.YES_SHARES, MarketTokens.YES_SHARES)
    const yesMarketCurrency = new MarketCurrency(marketId, cash, amm, yesToken, String(marketInfo?.yesAmount || 0))
    if (yesMarketCurrency) tokens.push(yesMarketCurrency)
    return tokens
  }, [userMarketShareBalances, marketId, cash, chainId, cashToken, amm])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const address = isAddress(tokenAddress)
  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useMarketToken(type: string) {
  const { marketId, cash, amm } = useSwapQueryParam()
  const allMarketTokens = useAllMarketTokens(marketId, cash, amm)
  return (allMarketTokens || []).find(a => a.name === type)
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = doUseETH(currencyId) || currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}
