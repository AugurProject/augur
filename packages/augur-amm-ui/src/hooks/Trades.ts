import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Price, Token, Trade, TradeType } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useCallback, useMemo } from 'react'

import { AmmExchangeInfo } from '../constants'
import { useAugurClient } from '../contexts/Application'
import { MarketCurrency } from '../data/MarketCurrency'
import { MarketBalance, useMarketBalance } from '../state/wallet/hooks'

export interface TradeInfo {
  amm: AmmExchangeInfo
  tradeType: TradeType
  currencyIn: Currency
  currencyOut: Currency
  inputAmount?: CurrencyAmount
  outputAmount?: CurrencyAmount
  balance: MarketBalance
  maxAmountIn?: number
  minAmountOut?: number
  priceImpact?: Percent
  executionPrice?: Price
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  ammExchange: AmmExchangeInfo,
  inputCurrency: Currency,
  currencyAmountIn?: CurrencyAmount,
  currencyOut?: Currency
): TradeInfo | null {
  let marketId = null
  let cash = null
  if (inputCurrency instanceof MarketCurrency) {
    const mc = inputCurrency as MarketCurrency
    marketId = mc.marketId
    cash = mc.cash
  }
  const balance = useMarketBalance(marketId, cash)
  const augurClient = useAugurClient()
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && inputCurrency) {
      console.log('exact in', currencyAmountIn, currencyOut, inputCurrency)
      // do any amount conversion here
      const decimals = currencyAmountIn.currency.decimals
      const amount = String(currencyAmountIn.raw)
      return {
        amm: ammExchange,
        tradeType: TradeType.EXACT_INPUT,
        currencyIn: inputCurrency,
        currencyOut,
        inputAmount: currencyAmountIn,
        balance,
        priceImpact: new Percent(JSBI.BigInt(0))
      }
    }
    return null
  }, [inputCurrency, currencyAmountIn, currencyOut, balance, augurClient, ammExchange])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(
  ammExchange: AmmExchangeInfo,
  outputCurrency: Currency,
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount
): TradeInfo | null {
  let marketId = null
  let cash = null
  if (outputCurrency instanceof MarketCurrency) {
    const mc = outputCurrency as MarketCurrency
    marketId = mc.marketId
    cash = mc.cash
  }
  const balance = useMarketBalance(marketId, cash)

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && outputCurrency) {
      console.log('exact out', currencyIn, currencyAmountOut)
      const decimals = currencyAmountOut.currency.decimals
      const amount = String(currencyAmountOut.raw)
      return {
        amm: ammExchange,
        tradeType: TradeType.EXACT_OUTPUT,
        currencyOut: outputCurrency,
        currencyIn,
        outputAmount: currencyAmountOut,
        balance,
        priceImpact: new Percent(JSBI.BigInt(0))
      }
    }
    return null
  }, [outputCurrency, currencyIn, currencyAmountOut, balance, ammExchange])
}
