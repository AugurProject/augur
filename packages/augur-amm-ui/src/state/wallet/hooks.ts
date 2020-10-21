import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { memo, useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  useMultipleContractMultipleData
} from '../multicall/hooks'
import { useAllMarketData } from '../../contexts/Markets'
import { ParaShareToken } from '@augurproject/sdk-lite'
import { Interface } from 'ethers/lib/utils'
import { BigNumber as BN } from 'bignumber.js'
/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])
  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useLPTokenBalances(): [{ [tokenAddress: string]: string | undefined }, boolean] {
  const { markets } = useAllMarketData()
  const { account } = useActiveWeb3React()
  const ammAddresses: string[] = markets
    ? markets.reduce((p, m) => (m.amms.length > 0 ? [...p, ...m.amms.map(a => a.id)] : p), [])
    : []
  const validatedTokenAddresses = useMemo(() => ammAddresses.map(address => address), [ammAddresses])
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [account])
  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        account && ammAddresses.length > 0
          ? ammAddresses.reduce<{ [tokenAddress: string]: string | undefined }>((memo, address, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? value.toString() : undefined
              if (amount) {
                memo[address] = amount
              }
              return memo
            }, {})
          : {},
      [account, ammAddresses, balances]
    ),
    anyLoading
  ]
}

export function useMarketShareBalances(): [
  { paraShareToken: string; marketid: string; outcome: number; amount: CurrencyAmount }[],
  boolean
] {
  const { markets, paraShareTokens } = useAllMarketData()
  const { account } = useActiveWeb3React()
  const paraShareTokenAddresses: string[] = paraShareTokens.map(p => p.id)

  const inputs: [] = useMemo(
    () => (markets ? markets.reduce((p, m) => [...p, [m.id, 1, account], [m.id, 2, account]], []) : []),
    [markets]
  )

  console.log(inputs)
  const balances = useMultipleContractMultipleData(
    paraShareTokenAddresses,
    new Interface(ParaShareToken.ABI),
    'balanceOfMarketOutcome',
    inputs
  )

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        account && inputs.length > 0
          ? inputs.reduce((memo, params, i) => {
              console.log('balances', JSON.stringify(balances[i].result))
              paraShareTokenAddresses.forEach((paraSharetokenAddress, j) => {
                const index = i + j;
                const amount = balances?.[i]?.result?.[0]
                const marketId = params[0]
                const outcome = params[1]
                if (amount > 0) {
                  const market = markets.find(m => m.id.toLowerCase() === String(marketId).toLowerCase())
                  const paraShareToken = paraShareTokens.find(p => p.id.toLowerCase() === paraSharetokenAddress)
                  let item = memo.find(i => i.paraSharetokenAddress === paraSharetokenAddress && i.marketId === marketId)
                  const amountName = outcome === 1 ? 'noAmount' : 'yesAmount'
                  if (item === undefined) {
                    item = { cash: paraShareToken.cash.id, paraSharetokenAddress, marketId, [amountName]: String(amount), market, paraShareToken }
                  } else {
                    item = { ...item, [amountName]: String(amount) }
                  }
                  memo = [...memo, item]
                }
              } )
              return memo
            }, [])
          : [],
      [account, inputs, balances, markets, paraShareTokenAddresses]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])
  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}
