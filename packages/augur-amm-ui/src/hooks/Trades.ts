import {
  Currency,
  CurrencyAmount,
  JSBI,
  Percent,
  TradeType
} from '@uniswap/sdk'

import { AmmExchangeInfo, MarketTokens } from '../constants'
import { MarketCurrency } from '../model/MarketCurrency'
import { MarketBalance } from '../state/wallet/hooks'
import { BigNumber as BN } from 'bignumber.js'

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
  executionPrice?: string
  minAmount?: string
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function getTradeExactIn(
  ammExchange: AmmExchangeInfo,
  inputCurrency: Currency,
  currencyAmountIn?: CurrencyAmount,
  currencyOut?: Currency,
  userCashBalances?: MarketBalance
): TradeInfo | null {

  console.log('inputCurrency', inputCurrency)
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

  if (currencyAmountIn && currencyOut && inputCurrency) {
    // do any amount conversion here
    const no = new BN(ammExchange.priceNo)
    const yes = new BN(ammExchange.priceYes)
    let executionPrice = currencyOut.symbol === MarketTokens.NO_SHARES ? no : yes

    console.log('no price', String(no))
    console.log('yes price', String(yes))
    if (!(currencyOut instanceof MarketCurrency)) {
      // cash out use inverse of currencyIn percentage
      const exchange = inputCurrency.symbol === MarketTokens.NO_SHARES ? no : yes
      // TODO: need to check this rate
      executionPrice = exchange
    }

    return {
      marketId,
      cash,
      amm: ammExchange,
      tradeType: TradeType.EXACT_INPUT,
      currencyIn: inputCurrency,
      currencyOut,
      inputAmount: currencyAmountIn,
      balance: userCashBalances,
      priceImpact: new Percent(JSBI.BigInt(0)),
      executionPrice: String(executionPrice)
    }
  }
  return null
}
