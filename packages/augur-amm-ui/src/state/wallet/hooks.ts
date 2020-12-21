import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  useMultipleContractMultipleData
} from '../multicall/hooks'
import { useAllMarketData, useMarketCashTokens } from '../../contexts/Markets'
import { ParaShareToken } from '@augurproject/sdk-lite'
import { Interface } from 'ethers/lib/utils'
import { Cash, MarketBalance, ZERO_ADDRESS } from '../../constants'
import { MarketCurrency } from '../../model/MarketCurrency'
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
            if (amount && amount !== "0") {
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

const outcomeNames = ['invalidAmount', 'noAmount', 'yesAmount']

export function useMarketShareBalances(): [MarketBalance[], boolean] {
  const { markets, paraShareTokens } = useAllMarketData()
  const { account } = useActiveWeb3React()
  const cashes = useMarketCashTokens()

  const userAccount = account ? account : ZERO_ADDRESS
  const paraTokenAdds: string[] = (paraShareTokens || []).map(p => p.id)

  const inputs: [] = useMemo(
    () =>
      markets
        ? markets.reduce((p, m) => [...p, [m.id, 0, userAccount], [m.id, 1, userAccount], [m.id, 2, userAccount]], [])
        : [],
    [markets]
  )

  const balances = useMultipleContractMultipleData(
    paraTokenAdds,
    new Interface(ParaShareToken.ABI),
    'balanceOfMarketOutcome',
    inputs
  )

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])
  const keyedMarkets = (markets || []).reduce((p, m) => ({ ...p, [m.id]: m }), {})
  const keyedParaTokens = (paraShareTokens || []).reduce((p, t) => ({ ...p, [t.id]: t }), {})
  const emptyBalances = paraTokenAdds.reduce((p, pTokenAddr) => [...p, ...inputs.map(m => ({ marketId: m[0], outcome: m[1], pTokenAddr }))], [])

  return [
    useMemo(
      () => {
        if (!userAccount || inputs.length === 0) return []
        const processBalances = balances.map((balance, i) => {
          let marketBalance = emptyBalances[i]
          const rawAmount = balance.result?.[0];
          const amount = rawAmount ? String(rawAmount) : '0';
          marketBalance.amount = amount;
          return marketBalance
        }).filter(p => p.amount !== '0' && p.amount !== 'undefined');
        return buildMarketBalance(processBalances, keyedParaTokens, keyedMarkets, outcomeNames, cashes)
      },
      [userAccount, inputs, balances, keyedMarkets, paraTokenAdds, keyedParaTokens, outcomeNames, cashes]
    ),
    anyLoading
  ]
}

function buildMarketBalance(pTokenAmounts, keyedParaTokens, keyedMarkets, outcomeNames, cashes) {
  return Object.values(pTokenAmounts.reduce((memo, pTokenAmount) => {
    const { pTokenAddr, marketId, amount } = pTokenAmount
    const key = `${pTokenAddr}-${marketId}`
    if (amount === '0') return memo
    const amountName = outcomeNames[pTokenAmount.outcome]
    let item = memo[key]
    if (item === undefined) {
      const outcomes = ['0', '0', '0']
      outcomes[pTokenAmount.outcome] = String(amount)
      const cash = cashes[keyedParaTokens[pTokenAddr].cash.id]
      memo[key] = {
        cash,
        marketId,
        [amountName]: amount,
        market: keyedMarkets[marketId],
        outcomes,
        paraShareToken: keyedParaTokens[pTokenAddr]
      }
    } else {
      const existingItem = { ...item, [amountName]: String(amount) }
      existingItem.outcomes[pTokenAmount.outcome] = String(amount)
      memo[key] = existingItem
    }
    return memo
  }, {})) as MarketBalance[]
}

export function useMarketBalance(marketId: string, cash: string): MarketBalance {
  const [balances] = useMarketShareBalances()

  return useMemo(() => (!cash || !marketId ? null : (balances || []).find(b => b.marketId === marketId && b.cash.address === cash)), [
    marketId,
    cash,
    balances
  ])
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
  const [userMarketShareBalances] = useMarketShareBalances()

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency && currency instanceof MarketCurrency) {
          return currency as TokenAmount
        }
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances, userMarketShareBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}
