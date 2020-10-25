import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Price, Token, TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useCallback, useMemo } from 'react'

import { AmmExchangeInfo, MarketTokens } from '../constants'
import { useAugurClient } from '../contexts/Application'
import { MarketCurrency } from '../data/MarketCurrency'
import { MarketBalance, useMarketBalance } from '../state/wallet/hooks'

export interface TradeInfo {
  marketId: string
  cash: string
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
  minAmount?: string
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
  if (currencyOut instanceof MarketCurrency) {
    const mc = currencyOut as MarketCurrency
    marketId = mc.marketId
    cash = mc.cash
  }
  const balance = useMarketBalance(marketId, cash)
  const augurClient = useAugurClient()
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && inputCurrency) {
      console.log('exact in', currencyAmountIn, currencyOut, inputCurrency)
      // do any amount conversion here
      const no = JSBI.BigInt(String(Number(ammExchange.percentageNo) / 100).substring(6))
      const yes = JSBI.BigInt(String(Number(ammExchange.percentageYes) / 100).substring(6))
      let executionPrice = new Price(currencyOut, currencyOut, currencyOut.symbol === MarketTokens.NO_SHARES ? no : yes, JSBI.BigInt(1))

      if (!(currencyOut instanceof MarketCurrency)) {
        // cash out use inverse of currencyIn percentage
        const exchange = inputCurrency.symbol === MarketTokens.NO_SHARES ? no : yes
        // TODO: need to check this rate
        executionPrice = new Price(currencyOut, currencyOut, JSBI.BigInt(1), exchange)
      }

      return {
        marketId,
        cash,
        amm: ammExchange,
        tradeType: TradeType.EXACT_INPUT,
        currencyIn: inputCurrency,
        currencyOut,
        inputAmount: currencyAmountIn,
        balance,
        priceImpact: new Percent(JSBI.BigInt(0)),
        executionPrice
      }
    }
    return null
  }, [inputCurrency, currencyAmountIn, currencyOut, balance, augurClient, ammExchange])
}

